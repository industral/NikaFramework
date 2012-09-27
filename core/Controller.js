(function() {
  "use strict";

  var ns = "nkf.core";
  var self = $.namespace(ns);

  Controller.className = "Controller";

  function Controller() {
    addEventHandler();

    function addEventHandler() {
      window.onhashchange = function(e) {
//        console.info(previousHash, "!", currentHash, "!", e.newURL, "!", e.oldURL);
        if ((currentHash !== e.newURL.match(hashPattern)[0])) {
//          console.warn(previousHash, currentHash, e.newURL, e.oldURL);

          $(document).trigger("nkf.core.Controller", {
            action: "load",
            actionType: nkf.def.events.type.make,
            pageName: Controller.getNormalizedObject(Controller.getCurrentPath()).pageName,
            params: Controller.getNormalizedObject(Controller.getCurrentPath()).params,
            init: true
          });
        }
      };

      $(document).bind("{ns}.{className}".format({
        ns: ns,
        className: Controller.className
      }), function(e, data) {
        if (data.action === "load" && data.actionType === nkf.def.events.type.make) {
          if (!isInit) {
            init();
          }

          if (!data) {
            data = {};
          }

          if (isInit) {
            data.pageName = data.pageName || Controller.getNormalizedObject(Controller.getCurrentPath()).pageName || "Home";
            data.params = data.clear ? data.params : $.extend({}, Controller.getNormalizedObject(Controller.getCurrentPath()).params, data.params);

            $(document).trigger("nkf.core.Controller", {
              actionType: nkf.def.events.type.is,
              action: "load",
              init: data.init
            });

            Controller.setCurrentPath(data);

            if (data.init) {
              ++historyCounter;

              componentManager.load(data);
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

    previousHash = currentHash;
    currentHash = output;

    window.location.hash = currentHash;
  };

  Controller.getNormalizedObject = function(url) {
    var output = {};

    var splited = Controller.getCurrentPath().split("|");

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

  var isInit = false;
})();
