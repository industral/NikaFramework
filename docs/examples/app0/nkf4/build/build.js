var $fs = require("fs");
var $exec = require("child_process").exec;
var $mime = require("mime");
var $zlib = require("zlib");
var CONFIG = require("optimist").argv;
var jsdom = require('jsdom');
var os = require('os');

var BUFFER = 5120000; //5000 * 1024

var components = {};

var processedComponentSpace = {};

var includes = JSON.parse($fs.readFileSync("build.json").toString());
var profiles = Object.keys(includes);

function init() {
  if (profiles.length) {
    processProfile(profiles[profiles.length - 1]);
  }
}

function processProfile(profileId) {
  components = {
    css: [],
    scss: [],
    xml: [],
    js: [],
    data: []
  };

  processedComponentSpace = {
    css: ""
  };

  var includeFiles = includes[profileId];

  includeFiles.forEach(function(value, key) {
    if (value.match(/file#/)) {
      var file = value.replace(/file#/, "");
      var fileType = file.match(/.(js|css|scss)/);

      components[fileType[1]].push(file);
    } else if (value.match(/component#/)) {
      var component = value.replace(/component#/, "");

      findAllFiles("../app/components/" + component);
    }
  });

  processJS(function() {
    processOtherComponents("css");

    processSass(function() {
      processOtherComponents("data");
      processOtherComponents("xml");

      if (!CONFIG["no-base64"]) {
        transformToBase64("css");
      }

      writeFiles(profileId);
    });
  });
}


function findAllFiles(path) {

  (function process(dir) {
    var dirList = $fs.readdirSync(dir);

    dirList.forEach(function(value) {
      if (!value.match(/^\./)) {
        var fileName = dir + "/" + value;

        var stat = $fs.statSync(fileName);
        if (stat.isDirectory()) {
          process(fileName);
        } else if (stat.isFile()) {
          var match = fileName.match(/js|json|xml|html|svg|css|scss$/);

          if (match) {
            var ext = match[0];

            var fileKey = fileName.replace("../", "");

            var container = null;

            switch (ext) {
              case "js":
                container = components.js;

                break;
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
              case "html":
              case "svg":
                container = components.xml;

                break;
              default:
                container = components.data;
            }

            if (container.indexOf(fileKey) === -1) {
              container.push(fileKey);
            }

          }
        }
      }
    });
  })(path);

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
      compileLineString += " --js=" + value;
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

    $exec("cd ../ && java -jar build/closure.jar --jscomp_off=internetExplorerChecks --warning_level=QUIET " + options + compileLineString, {maxBuffer: BUFFER},
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

        commandLineString += " sass " + value + " -I app/assets/styles/inc -g --cache-location=/tmp/.sass-cache --stop-on-error";
      }
    });

    $exec("cd ../ && " + commandLineString, {maxBuffer: BUFFER},
        function(error, stdout, stderr) {
          if (error || stderr) {
            console.error(error, stderr);
          } else {
            processedComponentSpace.css += stdout;

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
            processedComponentSpace.css += stdout;

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

      processedComponentSpace[componentName][value.replace("app/", "").replace(/\/(NLI|LI|PUB)\//, "/")] = content;
    });

    if (!CONFIG["no-base64"]) {
      transformToBase64(componentName);
    }

    //TODO: XML JSON OPTIMIZATION
  } else if (componentName === "css") {
    components[componentName].forEach(function(value, key) {
      var content = $fs.readFileSync("../" + value).toString();

      processedComponentSpace[componentName] += content;
    });

    if (!CONFIG["no-base64"]) {
      transformToBase64(componentName);
    }
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
      var fileName = _match[2].replace("/app/", "../app/");
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

function writeFiles(profileId) {
  var indexTemplateFile = $fs.readFileSync("../profiles/" + profileId + ".html").toString();

  jsdom.env(
      indexTemplateFile,
      function(errors, window) {

        if (errors) {
          console.log(errors);
        }

        //SCRIPT TAG
        if (!CONFIG["separate-files"]) {
          processedComponentSpace.js = "var __dom__ = " + processedComponentSpace.xml + "; var __json__ = " + JSON.stringify(processedComponentSpace.data) + "; " + processedComponentSpace.js;
        }

        if (CONFIG["js-source-map"]) {
          processedComponentSpace.js += "//@ sourceMappingURL=/source.map";
        }

        var isOutExist = $fs.existsSync("../generated");
        if (!isOutExist) {
          $fs.mkdirSync("../generated");
        }

        if (CONFIG["separate-files"]) {
          if (CONFIG["no-base64"]) {
            var out = "var __dom__ = {\n\n";

            for (var i in processedComponentSpace.xml) {
              out += '"' + i + '"' + ": " + "\n'" + processedComponentSpace.xml[i].replace(/\n/g, "\\\n").replace(/</g, "<") + "',\n\n";
            }

            out += "}";

            $fs.writeFileSync("../generated/" + profileId + "-templates.js", out);
          } else {
            $fs.writeFileSync("../generated/" + profileId + "-templates.js", processedComponentSpace.xml);
          }

          $fs.writeFileSync("../generated/" + profileId + "-scripts.js", processedComponentSpace.js);
          $fs.writeFileSync("../generated/" + profileId + "-styles.css", processedComponentSpace.css);
        }

        var scriptTag = window.document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");

        if (CONFIG["separate-files"]) {
          //        scriptTag.setAttribute("src", profileId + "-scripts.js");

          //        scriptTag.attr({
          //          src: "generated/scripts.js"
          //        }).text("");
        } else {
          scriptTag.textContent = processedComponentSpace.js;
        }

        var head = window.document.getElementsByTagName("head")[0];

        // STYLE TAG
        var cssTag = null;
        if (CONFIG["separate-files"]) {
          //        cssTag = $("<link />");
          //
          //        cssTag.attr({
          //          rel: "stylesheet",
          //          href: "generated/styles.css"
          //        });
        } else {
          cssTag = window.document.createElement("style");
          cssTag.setAttribute("rel", "stylesheet");
          cssTag.textContent = processedComponentSpace.css;

          //        var head = window.document.getElementsByTagName("head")[0];
          head.appendChild(cssTag);
          head.appendChild(scriptTag);
        }

        if (CONFIG["separate-files"]) {
          var scriptEl = window.document.createElement("script");
          scriptEl.setAttribute("src", profileId + "-scripts.js");

          var templateEl = window.document.createElement("script");
          templateEl.setAttribute("src", profileId + "-templates.js");

          var cssEl = window.document.createElement("link");
          cssEl.setAttribute("rel", "stylesheet");
          cssEl.setAttribute("href", profileId + "-styles.css");

          head.appendChild(templateEl);
          head.appendChild(scriptEl);
          head.appendChild(cssEl);
        }

        //      $zlib.gzip("<!DOCTYPE html>" + window.document.innerHTML, function(err, buffer) {
        //        if (!err) {
        //          $fs.writeFileSync("../generated/" + profileId + ".html", buffer);
        //
        //          profiles.pop();
        //          init();
        //        }
        //      });

        var node = window.document.doctype;
        var doctype = "<!DOCTYPE "
            + node.name
            + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
            + (!node.publicId && node.systemId ? ' SYSTEM' : '')
            + (node.systemId ? ' "' + node.systemId + '"' : '')
            + '>';

        $fs.writeFileSync("../generated/" + profileId + ".html", doctype + window.document.children[0].outerHTML);

        profiles.pop();
        init();
      });
}

init();
