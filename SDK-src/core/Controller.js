(function() {
  "use strict";

  var ns = "nkf.core";
  var self = $.namespace(ns);

  Controller.className = "Controller";

  function Controller() {
    addEventHandler();

    function addEventHandler() {
      window.onpopstate = function(event) {
        if (!event.state.init) {
          $(document).trigger("nkf.core.Controller", {
            type: nkf.def.events.type.make,
            name: "load",
            data: {
              pageName: Controller.getNormalizedObject(event.state.path).pageName,
              params: Controller.getNormalizedObject(event.state.path).params,
              init: true,
              type: "popstate"
            }
          });
        }
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
            object.data.pageName = object.data.pageName || Controller.getNormalizedObject(Controller.getCurrentPath()).pageName;
            object.data.params = object.data.clear ? object.data.params : $.extend({}, Controller.getNormalizedObject(Controller.getCurrentPath()).params, object.data.params);

            $(document).trigger("nkf.core.Controller", {
              type: nkf.def.events.type.is,
              name: "load",
              data: {
                init: object.data.init
              }
            });

            if (!object.data.appInit && object.data.type !== "popstate") {
              Controller.setCurrentPath(object.data);
            }

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
    var normalBrowsers = window.location.href.replace(window.location.protocol + "//" + window.location.host, "").replace(nkf.conf.URLSuffix, "").replace(/\/#\//, "").replace(/^\//, "");
    var ie = window.location.hash.replace(nkf.conf.URLSuffix, "").replace(/\#?\/?/, "");

    if (!!history.pushState) {
      return ie || normalBrowsers;
    } else {
      return normalBrowsers;
    }
  };

  Controller.setCurrentPath = function(data) {
    var output = nkf.conf.URLSuffix;
    output += "/" + data.pageName || Controller.getNormalizedObject(Controller.getCurrentPath()).pageName;

    if (data.params && $Utils.getObjectSize(data.params)) {
      var preparedData = $Utils.prepareURLObject(data.params);

      if ($Utils.getObjectSize(preparedData)) {
        var serializedData = $Utils.getSerializeObject(preparedData);

        output += "/" + serializedData;
      }
    }

    previousLogin = $.cookie("isLogin");

    history.pushState({path: output}, "", output);
  };

  Controller.getNormalizedObject = function(url) {
    var output = {};

    var resultURL = (url || Controller.getCurrentPath()).replace(/^\//, "");
    var splited = resultURL.split("/");

    var pageName = splited[0];
    var parameters = resultURL.replace(pageName, "").replace(/^\//, "");

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

  var historyCounter = -1;
  var previousLogin = false;

  var isInit = false;
})();
