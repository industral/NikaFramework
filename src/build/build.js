(function() {

  var $fs = require("fs");

  var out = [];

  function init() {
    readConfFile();

    var fileArray = $fs.readFileSync("include.list").toString().split("\n");

    fileArray.forEach(function(fileName) {
      if (fileName && !fileName.match(/^;/)) {
        var fileContent = $fs.readFileSync("../" + fileName).toString();

        out.push(fileContent);
      }
    });

    $fs.writeFileSync("../../nkf.js", out.join(""));
  }

  function readConfFile() {
    var version = $fs.readFileSync("../../VERSION").toString().trim();
    var configData = JSON.parse($fs.readFileSync("../core/config.json"));

    configData.version = version;

    out.push("window.nkf=" + JSON.stringify(configData) + ";");
  }

  init();

})();
