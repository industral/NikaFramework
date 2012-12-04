(function() {

  var $fs = require("fs");
  var $exec = require("child_process").exec;
  var $libxmljs = require("libxmljs");
  var $mime = require("mime");

  var components = {
    css: [],
    scss: [],
    xml: [],
    js: [],
    data: []
  };

  var processedComponentSpace = {
    js: "",
    css: "",
    xml: "",
    data: ""
  };

  function init() {
    getAllFiles();
    transformSass();
  }

  function getAllFiles() {
    readIncludeList();
    findAllFiles();
  }

  function readIncludeList() {
    var fileArray = $fs.readFileSync("include.list").toString().split("\n");

    fileArray.forEach(function(fileName) {
      if (fileName && !fileName.match(/^;/)) {
        var fileContent = $fs.readFileSync("../" + fileName).toString();
        var ext = fileName.split(".").pop();

        var o = {};
        o[fileName] = fileContent;

        var container = null;

        switch (ext) {
          case "js":
            container = components.js;
            break;
          case "scss":
            container = components.scss;
            break;
        }

        container.push(o);
      }
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

              var fileContent = $fs.readFileSync(fileName).toString();
              var fileKey = fileName.replace("../", "");

              var o = {};
              o[fileKey] = fileContent;

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

              var isKeyDoesnotExist = container.every(function(value, key) {
                return !(fileKey in value);
              });

              if (isKeyDoesnotExist) {
                container.push(o);
              }

            }
          }
        }
      });
    })("../impl");

  }

  function transformSass() {
    var output = "";

    components.scss.forEach(function(value, key) {
      for (aKey in value) {
        var match = aKey.split("/").pop().match(/^_/);

        if (!match) {
          output += "\n" + value[aKey];
        }
      }
    });

    var command = "cd ../ && echo '" + output + "' | sass -s --cache-location=/tmp --trace --stop-on-error --scss ";
    if (process.argv[2] !== "production") {
      command += "--debug-info";
    }

    $exec(command, {maxBuffer: 5000 * 1024},
      function(error, stdout, stderr) {
        if (error !== null) {
          console.log("exec error: " + error);
        } else {
          processNewComponent({
            name: "css",
            data: stdout
          });

          processNewComponent({
            name: "js"
          });

          processNewComponent({
            name: "data"
          });

          processNewComponent({
            name: "xml"
          });

          transformToBase64("css");
          transformToBase64("xml");

          writeFiles();
        }
      });
  }

  function processNewComponent(data) {
    var componentName = data.name;
    var output = "";

    if (componentName === "data") {
      output = {};

      components[componentName].forEach(function(value, key) {
        var objectKey = Object.keys(value)[0];

        output[objectKey.replace("impl/", "")] = value[objectKey];
      });
    } else if (componentName === "xml") {
      output = {};

      components[componentName].forEach(function(value, key) {
        var objectKey = Object.keys(value)[0];

        output[objectKey.replace("impl/", "")] = value[objectKey];
      });
    } else {
      components[componentName].forEach(function(value, key) {
        for (aKey in value) {
          output += value[aKey];
        }
      });

      if (componentName === "css") {
        output += data.data;
      }
    }

    processedComponentSpace[componentName] = output;
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
    var xmlData = optimize({
      data: processedComponentSpace.xml,
      type: "xml"
    });

    var d = new Date();
    var buildNumber = d.getMonth() + 1 + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    var jsData = "var __dom__ = " + xmlData + "\n" + "var __json__ = " + JSON.stringify(processedComponentSpace.data) + "\n" + processedComponentSpace.js + "\n" + "nkf.build=" + '"' + buildNumber + '"';

    var cssData = optimize({
      data: processedComponentSpace.css
    });

    $fs.writeFileSync("../../out/merged.js", jsData);
    $fs.writeFileSync("../../out/merged.css", cssData);

    if (process.argv[2] !== "production") {
      writeIndex();
    }

    if (process.argv[2] === "production") {
      $exec("java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --jscomp_off internetExplorerChecks --warning_level QUIET --js=../../out/merged.js > ../../out/merged.compressed.js", {maxBuffer: 5000 * 1024},
        function(error, stdout, stderr) {
          if (error !== null) {
            console.log("exec error: " + error);
          }

          if (stderr) {
            console.log(stderr);
          }

          if (!error && !stderr) {
            $exec("mv ../../out/merged.compressed.js ../../out/merged.js", {maxBuffer: 5000 * 1024},
              function(error, stdout, stderr) {
                if (error !== null) {
                  console.log("exec error: " + error);
                }

                if (stderr) {
                  console.log(stderr);
                }

                if (!error && !stderr) {
                  writeIndex();
                }
              });
          }
        });
    }

  }

  function writeIndex() {
    var indexTemplateFile = $fs.readFileSync("../../index.template.xhtml").toString();
    var xmlDoc = $libxmljs.parseXml(indexTemplateFile);

    var scriptTag = $libxmljs.Element(xmlDoc, "script");
    scriptTag.cdata($fs.readFileSync("../../out/merged.js").toString());

    var cssTag = $libxmljs.Element(xmlDoc, "style");
    cssTag.attr({
      type: "text/css"
    });
    cssTag.cdata($fs.readFileSync("../../out/merged.css").toString());

    var head = xmlDoc.get('//xmlns:html/xmlns:head', "http://www.w3.org/1999/xhtml");
    head.addChild(cssTag);
    head.addChild(scriptTag);

    $fs.writeFileSync("../../index.xhtml", xmlDoc.toString());

    $exec("gzip -f ../../index.xhtml", {maxBuffer: 5000 * 1024}, function(error, stdout, stderr) {
      if (error !== null) {
        console.log("exec error: " + error);
      }

      if (stderr) {
        console.log(stderr);
      }

      if (!error && !stderr) {
        $exec("mv ../../index.xhtml.gz ../../index.xhtmlz");
      }
    });
  }

  function optimize(params) {
    var data = params.data.replace(/\s+/g, " ");

    if (params.type === "xml") {
      data = params.data.replace(/\\n/g, "");
    }

    return data;
  }

  init();

})();
