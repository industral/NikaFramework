var restify = require("restify");
var fs = require("fs");

var server = restify.createServer();

server.use(restify.bodyParser({ mapParams: false }));

var dir = "../data/lang";
var list = {};

server.get("/languages", function(req, res, next) {
  var dirList = fs.readdirSync(dir);

  dirList.forEach(function(value) {
    if (!value.match(/^\./)) {
      var lang = value.replace("\.json", "");
      var buffer = fs.readFileSync(dir + "/" + value);

      list[lang] = JSON.parse(buffer.toString())
    }
  });

  res.send(list);
});

server.post("/save", function(req, res, next) {
  var data = req.body;

  list[data.lang].translate = JSON.parse(data.translate);

  fs.writeFileSync(dir + "/" + data.lang + ".json", JSON.stringify(list[data.lang]));

  res.send({});
});

server.listen(5001, function() {
  console.log("%s listening at %s", server.name, server.url);
});
