var $fs = require("fs");

var template = {};

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
          var match = fileName.match(/xml|xhtml|svg|css|scss$/);

          if (match) {
            var fileContent = $fs.readFileSync(fileName).toString();

            var matchedLocalizedStrings = fileContent.match(/{{(.)*?}}/g);

            if (matchedLocalizedStrings) {
              matchedLocalizedStrings.forEach(function(value) {
                var localizedText = value.replace(/[{}]/g, "");

                template[localizedText] = "";
              });
            }
          }
        }
      }
    });
  })("../impl");

}

function writeToFile() {
  $fs.writeFileSync("../../localization/template.json", JSON.stringify(template));
}


(function run() {
  findAllFiles();
  writeToFile();
})();
