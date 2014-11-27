(function() {
  'use strict';

  var self = nkf.core;

  Controller.className = 'Controller';

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
        params.pageName = params.pageName || _this.getURLObject().pageName;
        params.params = params.clear ? params.params : Object.assign({}, _this.getURLObject().params, params.params);

        if (params.e && (params.e.metaKey || params.e.ctrlKey)) {
        } else {
          if (params.e) {
            params.e.preventDefault();
          }

          if (!params.appInit && params.type !== 'popstate') {
            _this.setCurrentPath(params);
          }

          if (params.init) {
            delete params.type;

            if (params.init && nkf.impl.components.page[params.pageName] && nkf.impl.components.page[params.pageName].getURLParams) {
              params.params = nkf.impl.components.page[params.pageName].getURLParams(_this.getURLObject());
            }

            componentManager.load(params);
          }
        }
      }

      if (!params.noRedraw) {
        nkf.emit('nkf.core.Controller', {
          name: 'load',
          data: {
            init: params.init
          }
        });
      }
    };

    //FIXME: where we use it
    this.getCurrentPath = function() {
      return window.location.pathname.replace(nkf.conf.URLSuffix, '');
    };

    this.setCurrentPath = function(data) {
      var url = this.getURLFromObject(data);

      history.pushState({path: url}, '', url);
    };

    this.getURLObject = function(url) {
      url = url || window.location.href;

      var parser = document.createElement('a');
      parser.href = url;

      var params = {};

      var splitedPath = parser.pathname.split('/');
      var pageName = splitedPath[1].replace(/\//g, '');

      if (splitedPath.length === 3 || (splitedPath.length === 2 && pageName.match(':'))) {
        var suggestedParams = splitedPath[splitedPath.length - 1];

        var splitedParams = suggestedParams.match(/\w+:[\w()~]+/g);

        if (splitedParams) {
          splitedParams.forEach(function(value) {
            value = value.trim();

            if (value) {
              var keyValue = value.split(':');

              var k = keyValue[0];
              var v = keyValue[1];

              params[k] = v;
            }

          });
        }
      }

      if (pageName.match(':')) {
        pageName = nkf.conf.defaultPage;
      }

      return {
        pageName: pageName || nkf.conf.defaultPage,
        params: params
      };
    };

    this.getURLFromObject = function(object) {
      var parser = document.createElement('a');
      parser.href = '';

      if (object.pageName) {
        parser.pathname = object.pageName === nkf.conf.defaultPage ? '' : object.pageName;
      }

      if (object.params) {
        var paramsKeys = Object.keys(object.params);

        if (paramsKeys.length) {
          var outputParamsArray = [];


          paramsKeys.forEach(function(paramKey) {
            outputParamsArray.push(paramKey + ':' + object.params[paramKey])
          });

          parser.pathname += '/' + outputParamsArray.join(',');
          parser.pathname = parser.pathname.replace('//', '/');
        }
      }

      return parser.pathname;
    };

    this.getLanguage = function() {
      return nkf.core.utils.cookie('lang') || 'en';
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    function addEventHandler() {
      window.onpopstate = function(event) {
        if (!event.state || !event.state.init) {
          _this.load({
            pageName: _this.getURLObject().pageName,
            params: _this.getURLObject().params,
            init: true,
            type: 'popstate'
          });
        }
      };
    }

    function init() {
      if (!nkf.impl) {
        throw 'No implementation found';
      } else if (!nkf.impl.components) {
        throw 'No component found';
      } else if (!nkf.impl.components.layout) {
        throw 'No layout component found';
      } else if (!nkf.impl.components.page) {
        throw 'No page component found';
      }

      isInit = true;
    }

    addEventHandler();

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var _this = this;

    var componentManager = self.components.ComponentManager.getInstance();

    var isInit = false;
  }

  Object.assign(self, {
    Controller: new Controller()
  });

})();
