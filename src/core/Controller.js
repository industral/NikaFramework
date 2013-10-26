(function() {
  "use strict";

  var ns = "nkf.core";
  var self = $.namespace(ns);

  Controller.className = "Controller";

  function Controller() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.load = function(params) {
      if (!isInit) {
        init();
      }

      if (!params) {
        params = {};
      }

      if (isInit) {
        params.pageName = params.pageName || _this.getNormalizedObject(_this.getCurrentPath()).pageName;
        params.params = params.clear ? params.params : $.extend({}, _this.getNormalizedObject(_this.getCurrentPath()).params, params.params);

        if (!params.appInit && params.type !== "popstate") {
          _this.setCurrentPath(params);
        }

        if (params.init) {
          ++historyCounter;

          delete params.type;
          componentManager.load(params);
        }
      }

      if (!params.noRedraw) {
        $(document).trigger("nkf.core.Controller", {
          name: "load",
          data: {
            init: params.init
          }
        });
      }
    };

    this.getCurrentPath = function() {
      var normalBrowsers = window.location.href.replace(window.location.protocol + "//" + window.location.host, "").replace(nkf.conf.URLSuffix, "").replace(/\/#\//, "").replace(/^\//, "");
      var ie = window.location.hash.replace(nkf.conf.URLSuffix, "").replace(/\#?\/?/, "");

      if (!!history.pushState) {
        return ie || normalBrowsers;
      } else {
        return normalBrowsers;
      }
    };

    this.setCurrentPath = function(data) {
      var output = nkf.conf.URLSuffix;
      output += "/" + (data.pageName || _this.getNormalizedObject().pageName || "");

      if (data.params && $Utils.getObjectSize(data.params)) {
        var preparedData = $Utils.prepareURLObject(data.params);

        if ($Utils.getObjectSize(preparedData)) {
          var serializedData = $Utils.getSerializeObject(preparedData);

          output += "/" + serializedData;
        }
      }

      history.pushState({path: output}, "", output);
    };

    this.getNormalizedObject = function(url) {
      var output = {};

      var resultURL = (url || _this.getCurrentPath()).replace(/^\//, "");
      var splited = resultURL.split("/");

      var pageName = splited[0];
      var parameters = resultURL.replace(pageName, "").replace(/^\//, "");

      output.pageName = pageName;
      output.params = $Utils.getDeserializedObject(parameters);

      return output;
    };

    this.getHistoryCounter = function() {
      return historyCounter;
    };

    this.getLanguage = function() {
      return $.cookie("lang") || "en";
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    function addEventHandler() {
      window.onpopstate = function(event) {
        if (!event.state.init) {
          _this.load({
            pageName: _this.getNormalizedObject(event.state.path).pageName,
            params: _this.getNormalizedObject(event.state.path).params,
            init: true,
            type: "popstate"
          });
        }
      };
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

    addEventHandler();

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var _this = this;

    var componentManager = self.components.ComponentManager.getInstance();
    var $Utils = nkf.core.Utils;

    var historyCounter = -1;

    var isInit = false;
  }

  $.extend(self, {
    Controller: new Controller()
  });

})();
