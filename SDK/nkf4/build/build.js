var $fs = require("fs");
var $exec = require("child_process").exec;
var $libxmljs = require("libxmljs");
var $mime = require("mime");
var $zlib = require("zlib");
var CONFIG = require("optimist").argv;

var BUFFER = 5120000; //5000 * 1024

var components = {
  css: [],
  scss: [],
  xml: [],
  js: [],
  data: []
};

var processedComponentSpace = {};

function init() {
  readIncludeList();
  findAllFiles();

  processJS(function() {
    processSass(function() {
      processOtherComponents("data");
      processOtherComponents("xml");
      processOtherComponents("css");

      writeFiles();
    });
  });
}

function readIncludeList() {
  var fileArray = $fs.readFileSync("include.list").toString();

  components.js = fileArray.split("\n").filter(function(e) {
    return e && e[0] !== ";"
  });
}

function findAllFiles() {

  (function process(dir) {
    var dirList = $fs.readdirSync(dir);

    dirList.forEach(function(value) {
      if (!value.match(/^\./)) {
        var fileName = dir + "/" + value;

        var stat = $fs.statSync(fileName);
        if (stat.isDirectory()) {
          process(fileName);
        } else if (stat.isFile()) {
          var match = fileName.match(/json|xml|xhtml|svg|css|scss$/);

          if (match) {
            var ext = match[0];

            var fileKey = fileName.replace("../", "");
            var container = null;

            switch (ext) {
              case "json":
                container = components.data;

                break;
              case "css":
                container = components.css;

                break;
              case "scss":
                container = components.scss;

                break;
              case "xml":
              case "xhtml":
              case "svg":
                container = components.xml;

                break;
            }

            if (container.indexOf(fileKey) === -1) {
              container.push(fileKey);
            }

          }
        }
      }
    });
  })("../app");

}

function processJS(callback) {
  // FAST
  if (!CONFIG["js-source-map"] && (!CONFIG["js-optimization"] || CONFIG["js-optimization"] === "whitespace")) {
    var output = "";

    components.js.forEach(function(value, key) {
      output += $fs.readFileSync("../" + value).toString();
    });

    processedComponentSpace.js = output;

    callback();
  } else {
    // SLOW
    var compileLineString = "";
    var options = "";

    components.js.forEach(function(value, key) {
      compileLineString += " --js=nkf4/" + value;
    });

    if (CONFIG["js-source-map"]) {
      options += " --create_source_map=source.map --source_map_format=V3 ";
    }

    if (CONFIG["js-optimization"]) {
      switch (CONFIG["js-optimization"]) {
        case "simple":
          options += " --compilation_level=SIMPLE_OPTIMIZATIONS ";

          break;
        case "advanced":
          options += " --compilation_level=ADVANCED_OPTIMIZATIONS ";

          break;
      }
    } else {
      options += " --compilation_level=WHITESPACE_ONLY ";
    }

    $exec("cd ../../ && java -jar nkf4/build/closure.jar --jscomp_off=internetExplorerChecks --warning_level=QUIET " + options + compileLineString, {maxBuffer: BUFFER},
        function(error, stdout, stderr) {
          if (error || stderr) {
            console.error(error, stderr);
          } else {
            processedComponentSpace.js = stdout;

            callback();
          }
        });
  }
}

function processSass(callback) {
  var commandLineString = "";

  if (CONFIG["sass-debug"]) {
    components.scss.forEach(function(value, key) {
      var match = value.split("/").pop().match(/^_/);

      if (!match) {
        if (commandLineString) {
          commandLineString += " && ";
        }

        commandLineString += " sass" + value + " -I app/assets/styles/inc -g --cache-location=/tmp/.sass-cache --stop-on-error";
      }
    });

    $exec("cd ../ && " + commandLineString, {maxBuffer: BUFFER},
        function(error, stdout, stderr) {
          if (error || stderr) {
            console.error(error, stderr);
          } else {
            processedComponentSpace.css = stdout;

            callback();
          }
        });
  } else {
    var output = "";

    components.scss.forEach(function(value, key) {
      var match = value.split("/").pop().match(/^_/);

      if (!match) {
        output += $fs.readFileSync("../" + value).toString();
      }
    });

    $exec("cd ../ && echo '" + output + "' | sass " + " -t compressed -I app/assets/styles/inc --cache-location=/tmp/.sass-cache --stop-on-error --scss -s", {maxBuffer: BUFFER},
        function(error, stdout, stderr) {
          if (error || stderr) {
            console.error(error, stderr);
          } else {
            processedComponentSpace.css = stdout;

            callback();
          }
        });
  }
}

function processOtherComponents(componentName) {
  if (componentName === "data") {
    processedComponentSpace[componentName] = {};

    components[componentName].forEach(function(value, key) {
      var content = $fs.readFileSync("../" + value).toString();

      if (CONFIG["data-optimization"]) {
        content = content.replace(/\s+/g, " ").replace(/\n/g, " ");
      }

      processedComponentSpace[componentName][value.replace("app/", "")] = content;
    });
  } else if (componentName === "xml") {
    processedComponentSpace[componentName] = {};

    components[componentName].forEach(function(value, key) {
      var content = $fs.readFileSync("../" + value).toString();

      if (CONFIG["xml-optimization"]) {
        content = content.replace(/\s+/g, " ").replace(/\n/g, " ");
      }

      processedComponentSpace[componentName][value.replace("app/", "")] = content;
    });

    transformToBase64(componentName);

    //TODO: XML JSON OPTIMIZATION
  } else if (componentName === "css") {
    transformToBase64(componentName);
  }
}

function transformToBase64(componentName) {
  var regex = null;
  var data = null;

  switch (componentName) {
    case "css":
      data = processedComponentSpace.css;
      regex = '(url)\\("\([^"]+)"\\)';

      break;
    case "xml":
      data = JSON.stringify(processedComponentSpace.xml);
      regex = '(src|xlink\:href)=."([^\\\\"]+)';

      break;
  }

  var match = data.match(new RegExp(regex, "g"));

  if (match) {
    var foundCount = match.length;

    for (var i = 0; i < foundCount; ++i) {
      var _match = match[i].match(new RegExp(regex));
      var fileName = _match[2].replace("/nkf4/", "../");
      fileName = fileName.replace(/#.+/, "");

      if (!fileName.match(/^#|^data:|\.webm$/)) {
        try {
          var buffer = $fs.readFileSync(fileName);
          var dataURI;
          var mime = $mime.lookup(fileName);
          var dataURIBase64Data = buffer.toString("base64");

          if (componentName === "css") {
            if (mime === "image/svg+xml") {
              var hash = _match[2].match(/#.+/);
              var filteredData = buffer.toString().replace(/\n/g, "").replace(/\s+/g, " ");
              dataURI = "url(\"data:" + mime + "," + encodeURIComponent(filteredData) + (hash.length ? hash[0] : "") + "\")";
            } else {
              dataURI = "url(data:" + mime + ";base64," + dataURIBase64Data + ")";
            }
          } else if (componentName === "xml") {
            dataURI = _match[1] + "=\\\"data:" + mime + ";base64," + dataURIBase64Data;
          }

          data = data.replace(match[i], dataURI);
        } catch (e) {
          console.error(e.message);
        }
      }
    }
  }

  processedComponentSpace[componentName] = data;
}

function writeFiles() {
  var indexTemplateFile = $fs.readFileSync("../index.template.xhtml").toString();
  var xmlDoc = $libxmljs.parseXml(indexTemplateFile);

  var scriptTag = $libxmljs.Element(xmlDoc, "script");

  //SCRIPT TAG
  processedComponentSpace.js = "var __dom__ = " + processedComponentSpace.xml + "; var __json__ = " + JSON.stringify(processedComponentSpace.data) + "; " + processedComponentSpace.js;

  if (CONFIG["js-source-map"]) {
    processedComponentSpace.js += "//@ sourceMappingURL=/source.map";
  }

  scriptTag.cdata(processedComponentSpace.js);

  // STYLE TAG
  var cssTag = $libxmljs.Element(xmlDoc, "style");
  cssTag.attr({
    type: "text/css"
  });
  cssTag.cdata(processedComponentSpace.css);

  //TODO: in simple mode optimization version coudn't be found. Need to think how to do it better
//  var nkfVersion = processedComponentSpace.js.match(/,"version":"(.\..\..)/)[1];
//  var metaTag = $libxmljs.Element(xmlDoc, "meta");
//  metaTag.attr({
//    name: "generator",
//    content: "NikaFramework " + nkfVersion
//  });

  var head = xmlDoc.get('//xmlns:html/xmlns:head', "http://www.w3.org/1999/xhtml");
//  head.addChild(metaTag);
  head.addChild(cssTag);
  head.addChild(scriptTag);

  $zlib.gzip(xmlDoc.toString(), function(err, buffer) {
    if (!err) {
      $fs.writeFileSync("../../index.xhtmlz", buffer);
    }
  });
}

init();
