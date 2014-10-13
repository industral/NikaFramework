(function() {
  "use strict";

  var self = nkf.core;

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
        params.pageName = params.pageName || _this.getNormalizedObject().pageName;
        params.params = params.clear ? params.params : Object.assign({}, _this.getNormalizedObject().params, params.params);

        //if ($("body").attr("data-edit-mode") == "true") {
        //  params.params = params.params || {};
        //  params.params.mode = "edit";
        //}

        if (!params.appInit && params.type !== "popstate") {
          _this.setCurrentPath(params);
        }

        if (params.init) {
          ++historyCounter;

          delete params.type;

          if (params.init && nkf.impl.components.page[params.pageName] && nkf.impl.components.page[params.pageName].getURLParams) {
            params.params = nkf.impl.components.page[params.pageName].getURLParams(_this.getNormalizedObject());
          }

          componentManager.load(params);
        }
      }

      if (!params.noRedraw) {
        nkf.emit("nkf.core.Controller", {
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

      if (data.params && utils.getObjectSize(data.params)) {
        var preparedData = utils.prepareURLObject(data.params);

        if (utils.getObjectSize(preparedData)) {
          var serializedData = utils.getSerializeObject(preparedData);

          if (output === "/") {
            output += serializedData;
          } else {
            output += "/" + serializedData;
          }
        }
      }

      history.pushState({path: output}, "", output);
    };

    //TODO: unit tests
    this.getNormalizedObject = function(url) {
      var output = {};

      var resultURL = (url || _this.getCurrentPath()).replace(/^\//, "");
      var splited = resultURL.split("/");

      var pageName = splited[0];
      if (decodeURIComponent(pageName)[0] === "{") {
        parameters = decodeURIComponent(decodeURIComponent(pageName));
        pageName = "Home";
      } else {
        var parameters = resultURL.replace(pageName, "").replace(/^\//, "");
      }

      output.pageName = pageName;
      output.params = utils.getDeserializedObject(parameters);

      return output;
    };

    this.getHistoryCounter = function() {
      return historyCounter;
    };

    this.getLanguage = function() {
      return nkf.core.utils.cookie("lang") || "en";
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    function addEventHandler() {
      window.onpopstate = function(event) {
        if (!event.state || !event.state.init) {
          _this.load({
            pageName: _this.getNormalizedObject().pageName,
            params: _this.getNormalizedObject().params,
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
    var utils = nkf.core.utils;

    var historyCounter = -1;

    var isInit = false;
  }

  Object.assign(self, {
    Controller: new Controller()
  });

})();
