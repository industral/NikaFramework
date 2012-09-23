(function() {
  "use strict";

  var ns = "nkf.core";
  var self = $.namespace(ns);

  Controller.className = "Controller";

  function Controller() {
    addEventHandler();

    function addEventHandler() {
      window.onhashchange = function(e) {
        if (hashChangeAllowed) {

//          $(document).trigger("nkf.core.Controller.load", {
//            pageName: Controller.getNormalizedObject(Controller.getCurrentPath()).pageName,
//            params: Controller.getNormalizedObject(Controller.getCurrentPath()).params
//          });

//          componentManager.load({
//            pageName: Controller.getNormalizedObject(Controller.getCurrentPath()).pageName,
//            params: Controller.getNormalizedObject(Controller.getCurrentPath()).params,
//          });
        } else {
          hashChangeAllowed = true;
        }
      };

      $(document).bind("{ns}.{className}.load".format({
        ns: ns,
        className: Controller.className
      }), function(e, data) {
        if (!isInit) {
          init();
        }

        if (!data) {
          data = {};
        }

        if (isInit) {
          data.pageName = data.pageName || Controller.getNormalizedObject(Controller.getCurrentPath()).pageName || "Home";
          data.params = $.extend({}, Controller.getNormalizedObject(Controller.getCurrentPath()).params, data.params);

          Controller.setCurrentPath(data);

          if (data.init) {
            componentManager.load(data);
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
      output += "|" + $Utils.getSerializeObject(data.params);
    }

    hashChangeAllowed = false;

    window.location.hash = output;

    hashChangeAllowed = true;
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

  $.extend(self, {
    Controller: Controller
  });

  var controller = new Controller();
  var componentManager = new self.components.ComponentManager.getInstance();
  var $Utils = nkf.core.Utils;

  var hashChangeAllowed = true;

  var isInit = false;
})();
