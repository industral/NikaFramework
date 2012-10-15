(function() {
  "use strict";

  var ns = "nkf.core";
  var self = $.namespace(ns);

  Controller.className = "Controller";

  function Controller() {
    addEventHandler();

    function addEventHandler() {
      window.onhashchange = function(e) {
        if ((previousHash && (Controller.getNormalizedObject(previousHash).pageName !== Controller.getNormalizedObject(decodeURIComponent(window.location.hash)).pageName)) || (!previousLogin && $.cookie("isLogin"))) {
          $(document).trigger("nkf.core.Controller", {
            type: nkf.def.events.type.make,
            name: "load",
            data: {
              pageName: Controller.getNormalizedObject(Controller.getCurrentPath()).pageName,
              params: Controller.getNormalizedObject(Controller.getCurrentPath()).params,
              init: true
            }
          });
        }

        previousHash = window.location.hash;
        previousLogin = $.cookie("isLogin");
      };

      $(document).bind("{ns}.{className}".format({
        ns: ns,
        className: Controller.className
      }), function(e, object) {
        if (object.type === nkf.def.events.type.make && object.name === "load") {
          if (!isInit) {
            init();
          }

          if (!object) {
            object = {};
          }

          if (!object.data) {
            object.data = {};
          }

          if (isInit) {
            object.data.pageName = object.data.pageName || Controller.getNormalizedObject(Controller.getCurrentPath()).pageName || "Home";
            object.data.params = object.data.clear ? object.data.params : $.extend({}, Controller.getNormalizedObject(Controller.getCurrentPath()).params, object.data.params);

            $(document).trigger("nkf.core.Controller", {
              type: nkf.def.events.type.is,
              name: "load",
              data: {
                init: object.data.init
              }
            });

            Controller.setCurrentPath(object.data);

            if (object.data.init) {
              ++historyCounter;

              componentManager.load(object.data);
            }
          }
        }
      });
    }

    function init() {
      if (!nkf.impl) {
        throw "No implementation found";
      } else if (!nkf.impl.components) {
        throw "No component found";
      } else if (!nkf.impl.components.layout) {
        throw "No layout component found";
      } else if (!nkf.impl.components.page) {
        throw "No page component found";
      }

      isInit = true;
    }
  }

  Controller.getCurrentPath = function() {
    return window.location.hash.replace(nkf.conf.def.hash, "");
  };

  Controller.setCurrentPath = function(data) {
    var output = nkf.conf.def.hash + (data.pageName || Controller.getNormalizedObject(Controller.getCurrentPath()).pageName);

    if (data.params && $Utils.getObjectSize(data.params)) {
      var preparedData = $Utils.prepareURLObject(data.params);

      if ($Utils.getObjectSize(preparedData)) {
        var serializedData = $Utils.getSerializeObject(preparedData);

        output += "|" + serializedData;
      }
    }

    previousLogin = $.cookie("isLogin");
    if (!previousHash) {
      previousHash = "#page=Home";
    }
    currentHash = output;

    window.location.hash = currentHash;
  };

  Controller.getNormalizedObject = function(url) {
    var output = {};

    var splited = (url || Controller.getCurrentPath()).replace(/(.+)?#.+=/g, "").split("|");

    var pageName = splited[0];
    var parameters = splited[1];

    output.pageName = pageName;
    output.params = $Utils.getDeserializedObject(parameters);

    return output;
  };

  Controller.getHistoryCounter = function() {
    return historyCounter;
  };

  $.extend(self, {
    Controller: Controller
  });

  var controller = new Controller();
  var componentManager = new self.components.ComponentManager.getInstance();
  var $Utils = nkf.core.Utils;

  var hashPattern = new RegExp(nkf.conf.def.hash + ".+", "g");

  var historyCounter = -1;

  var currentHash = "";
  var previousHash = "";
  var previousLogin = false;

  var isInit = false;
})();
