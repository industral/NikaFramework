(function() {
  "use strict";

  $.namespace("nkf.core.components.component");

  var ns = "nkf.core.components";
  var self = $.namespace(ns);

  ComponentManager.className = "ComponentManager";

  function ComponentManager() {
    this.className = ComponentManager.className;

    constructor();
    addEventsHandler();

    this.load = function(data) {
      userSettings = getSettings();
      getData(data);
    };

    this.getData = function() {
      return pageData;
    };

    //TODO: replace data and params with params
    this.setData = function(data, params) {
      var type = (params && params.type) || $Utils.getComponentType(this);

      pageData = pageData || {};
      pageData.components = pageData.components || {};

      pageData.components[type] = pageData.components[type] || {};
      pageData.components[type][(params && params.className) || this.constructor.className] = data;
    };

    this.getPreRenderedDOM = function() {
      return preRenderedDOM;
    };

    this.setPreRenderedDOM = function(dom) {
      preRenderedDOM = dom;
    };

    /**
     * Returns current used components, such as "layout" and "page"
     */
    this.getCurrentComponents = function() {
      return currentComponents;
    };

    this.getComponentsList = function() {
      return componentsList;
    };

//    this.getGlobalComponentsData = function() {
//      return $StorageManager.getData("nkf3.global");
//    };

    this.getPageName = function(name) {
      var login = isLogin();

      if (login) {
        return name ? name : nkf.conf.defaultLoggedInPage;
      } else {
        return nkf.conf.useLogin ? nkf.conf.defaultNotLoggedInPage : name || nkf.conf.defaultLoggedInPage;
      }
    };

    this.getLayoutName = function(name) {
      var login = isLogin();

      if (login) {
        return name ? name : nkf.conf.defaultLoggedInLayout;
      } else {
        return nkf.conf.useLogin ? nkf.conf.defaultNotLoggedInLayout : name || nkf.conf.defaultLoggedInLayout;
      }
    };

    this.localize = function(inputData) {
      function doLocalize(inputData) {
        //TODO: using $.each(*, ... ) search all nodes in root element. But if you have only root - nothing will be searched
        $.each($("*", inputData.dom || preRenderedDOM), function(key, value) {

          $.each($(value).getAttributes(), function(aKey, text) {
            var matched = aKey.match(/^data-nkf-lang-(.+)/);

            if (matched) {
              var attributeName = matched[1];

              var strings4translate = text.match(/{{(.)*?}}/g);

              if (strings4translate) {
                $.each(strings4translate, function(aKey, aValue) {
                  var string4translate = aValue.replace(/[{}]/g, "");
                  var translatedString = languageCache[inputData.lang].translate[string4translate];

                  var output = $(value).attr("data-nkf-lang-" + attributeName).replace(aValue, translatedString || string4translate);

                  if (attributeName === "textcontent") {
                    $(value).text(output);
                  } else {
                    $(value).attr(attributeName, output);
                  }
                });
              } else {
                var output = $(value).attr("data-nkf-lang-" + attributeName);

                if (attributeName === "textcontent") {
                  $(value).text(output);
                } else {
                  $(value).attr(attributeName, output);
                }
              }
            }

          });
        });

        //CSS
        //TODO: will be perform in each action when localize does.. should be fixed
        //TODO: document.styleSheets[0] ? hack
        var strings = [];
        var matched = $.map(document.styleSheets[0].cssRules, function(value, key) {
          if (value.selectorText) {
            var match = value.selectorText.match(/:after|:before/g);
            if (match) {
              strings.push(value.style.content);

              return value;
            }
          }
        });

        if (!originalStrings) {
          originalStrings = strings.slice();
        }

        $.each(matched, function(key, value) {
          var content = originalStrings[key];

          if (content) {
            var strings4translate = content.match(/{{(.)*?}}/g);

            if (strings4translate) {
              $.each(strings4translate, function(aKey, aValue) {
                var string4translate = aValue.replace(/[{}]/g, "");
                var translatedString = languageCache[inputData.lang].translate[string4translate];

                value.style.content = content.replace(aValue, translatedString || string4translate);
              });
            }
          }
        });

        $("html").attr({
          dir: languageCache[inputData.lang].settings && languageCache[inputData.lang].settings.dir || "ltr"
        });

        $(document).trigger("nkf.core.components.ComponentManager", {
          type: nkf.def.events.type.is,
          name: "localize",
          data: {
            lang: inputData.lang
          }
        });
      }

      if (nkf.conf.localization) {
        inputData.lang = inputData.lang || $.cookie("lang") || "en";

        $("body").attr("data-nkf-lang", inputData.lang);

        if (!languageCache[inputData.lang]) {
          $.ajax({
            //TODO: move /data/lang/, .json to settings
            url: nkf.conf.URLSuffix + "/data/lang/" + inputData.lang + ".json",
            async: false,
            success: function(data) {
              currentLanguageName = inputData.lang;

              languageCache[currentLanguageName] = data;

              doLocalize(inputData);
            }
          });
        } else {
          currentLanguageName = inputData.lang;

          doLocalize(inputData);
        }
      }
    };

    function getSettings() {
      userSettings = $UserSettings.getSettings();
    }

    function renderScreen(data) {
      $("body").attr({
        "data-status": "loading"
      });

      preRenderScreen(data);
      postRenderScreen();
    }

    function preRenderScreen(data) {
      componentsList = [];

      if (data.renderLayout) {
        Render.layout({
          component: data.layout,
          dom: preRenderedDOM
        });
      }

      Render.page({
        component: data.page,
        dom: preRenderedDOM
      });

      $.each(componentsList, function(key, value) {

        var componentType = $Utils.getComponentType(value);

        var componentSettings = pageData.components && pageData.components[componentType] &&
            pageData.components[componentType][value.className] &&
            pageData.components[componentType][value.className].settings || {};

        if ($Utils.getComponentType(value) === nkf.enumType.Component.widget) {
          value.setState({
            type: nkf.def.events.type.is,
            name: nkf.def.component.action.state,
            data: {
              state: componentSettings.state,
              "state-effect": componentSettings["state-effect"]
            }
          });
        }
      });

      _this.localize({
        lang: $.cookie("lang") || $("body").attr("data-nkf-lang") || "en"
      });

      $(document).trigger(ns + "." + ComponentManager.className, {
        type: nkf.def.events.type.is,
        name: "preAppend"
      });

      if (!$("body > [data-nkf-component-type=layout]").length) {
        $(nkf.conf.render.body.selector).append(preRenderedDOM);
      }

      $(document).trigger(ns + "." + ComponentManager.className, {
        type: nkf.def.events.type.is,
        name: "appended"
      });

      $.each(componentsList, function(key, value) {
        var component = $Utils.getComponentNS(value);

        $(document).trigger(component, {
          //TODO: check with settings
          type: nkf.def.events.type.is,
          name: nkf.def.component.action.rendered,
          data: {
            state: nkf.def.component.render.state.showed
          }
        });
      });

      $(document).trigger(ns + "." + ComponentManager.className, {
        type: nkf.def.events.type.is,
        name: nkf.def.component.action.rendered,
        data: {
          state: nkf.def.component.render.state.showed
        }
      });

      $("body").attr({
        "data-status": "loaded"
      });
    }

    function postRenderScreen() {
      $.each(componentsList, function(key, value) {
        var postInit = value.postInit;

        if (postInit) {
          postInit();
        }
      });
    }

    function checkIncludedComponents(params) {
      var componentSelector = "[{component}]".format({
        component: nkf.conf.def.attr.component.type
      });

      $.each(params.dom.find(componentSelector), function(key, value) {
        var dom = $(value);

        var componentType = dom.attr(nkf.conf.def.attr.component.type);
        var componentName = dom.attr(nkf.conf.def.attr.component.name);
        var componentClass = $Utils.getComponentByNS("{componentType}.{componentName}".format({
          componentType: componentType,
          componentName: componentName
        }));

        if (componentClass) {
          var renderClass = Render[componentType];
          if (renderClass) {
            renderClass({
              component: componentClass,
              dom: dom,
              parent: params.component
            });
          }
        } else {
          console.error("Can't resolve", componentType + "." + componentName);
        }

      });
    }

    function getData(params) {
      var layoutName = _this.getLayoutName(params && params.layoutName);
      var pageName = _this.getPageName(params && params.pageName);

      var layoutClass = nkf.impl.components.layout[layoutName];
      var pageClass = nkf.impl.components.page[pageName];

      if (!layoutClass) {
        throw "No layout class for " + layoutName + " found";
      }

      if (!pageClass) {
        throw "No page class for " + pageName + " found";
      }

      var isNeedToRenderLayout = !preRenderedDOM || (preRenderedDOM && currentLayoutName !== layoutName);

      currentComponents = {
        layout: layoutClass,
        page: pageClass,
        renderLayout: isNeedToRenderLayout
      };

      currentLayoutName = layoutName;
      currentPageName = pageName;

      function callback(data) {
        $(document).trigger(ns + "." + ComponentManager.className, {
          type: nkf.def.events.type.is,
          name: "dataFetched",
          data: {
            pageName: pageName,
            data: data
          }
        });

        renderScreen(currentComponents);

        (_this.getPreRenderedDOM() || $("body")).find(nkf.conf.loadingMaskSelector).addClass(nkf.conf.classes.none);
      }

      (_this.getPreRenderedDOM() || $("body")).find(nkf.conf.loadingMaskSelector).removeClass(nkf.conf.classes.none);

      //TODO: option to not load data
      //TODO: option to add additional params
      //TODO: option to add custom pageName for URL
      //TODO: [conf] option for extension
      var pageNameURL = "{pageURL}/{pageName}".format({
        pageURL: nkf.conf.URLSuffix + nkf.conf.pageURL,
        pageName: params.pageURLName || pageClass.className
      });

      if (nkf.conf.pageNameExtension) {
        pageNameURL += "." + nkf.conf.pageNameExtension;
      }

      if (nkf.conf.usePageLoadStandardBehaviour) {
        $NetworkManager.get({
          url: pageNameURL,
          data: params.params,
          type: params.type ? params.type : "get",
          statusCode: {
            200: function(data) {
              pageData = $.extend(true, {}, data);

              callback(pageData);
            },
            401: function(data) {
//            renderScreen({
//              layout: nkf.impl.layout.NotLogin,
//              page: nkf.impl.page.Index
//            });
            }
          }
        });
      } else {
        if (pageClass.dataProvider) {
          pageClass.dataProvider({
            callback: callback
          });
        } else {
          callback({});
        }
      }
    }

    function Render() {
    }

    //TODO: the same methods move
    Render.layout = function(params) {
      var component = params.component.getInstance ? params.component.getInstance() : new params.component(params);

      if (component.reInit && component.isConstructed) {
        component.reInit();
      }

      if (component.Constructor && !component.isConstructed) {
        component.Constructor();
        component.isConstructed = true;
      }

      if (component.init) {
        component.init();
      }

      var dom = component.render({
        dom: params.dom
      });

      componentsList.push(component);

      checkIncludedComponents({
        dom: dom,
        component: params.component
      });
    };

    Render.page = function(params) {
      var component = params.component.getInstance ? params.component.getInstance() : new params.component(params);

      if (component.reInit && component.isConstructed) {
        component.reInit();
      }

      if (component.Constructor && !component.isConstructed) {
        component.Constructor();
        component.isConstructed = true;
      }

      if (component.init) {
        component.init();
      }

      params.dom.data({
        rendered: true
      });

      var dom = component.render({
        dom: params.dom
      });

      componentsList.push(component);

      checkIncludedComponents({
        dom: dom,
        component: params.component
      });
    };

    Render.widget = function(params) {
      if (!params.dom.data("rendered")) {
        var widgetName = params.dom.attr("data-nkf-component-name");
        var layout = nkf.conf.layoutSettings[widgetName];

        if (layout && layout !== currentLayoutName) {
          preRenderedDOM.find("[data-nkf-component-type=widget][data-nkf-component-name={name}]".format({
            name: widgetName
          })).remove();
        } else {
          var component = params.component.getInstance ? params.component.getInstance() : new params.component(params);

          if (component.reInit && component.isConstructed) {
            component.reInit();
          }

          if (component.Constructor && !component.isConstructed) {
            component.Constructor();
            component.isConstructed = true;
          }

          if (component.init) {
            component.init();
          }

          params.dom.data({
            rendered: true
          });

          var dom = component.render({
            dom: params.dom
          });

          componentsList.push(component);

          checkIncludedComponents({
            dom: dom,
            component: params.component
          });
        }
      }
    };

    function constructor() {
      if (ComponentManager.instance) {
        console.error("Please use getInstance method instead of creating new instance");
      }
    }

    function addEventsHandler() {
      $(document).bind(ns + "." + ComponentManager.className, function(e, object) {
        if (object.type === nkf.def.events.type.make && object.name === "localize") {
          _this.localize({
            lang: object.data.lang
          });
        }
      });
    }

    function isLogin() {
      return !!(nkf.conf.useLogin ? $.cookie("isLogin") : false);
    }

    constructor.call(this);

    var _this = this;

    var pageData = {
      components: {}
    };

    var currentLanguageName = "en";

    var userSettings = null;
    var preRenderedDOM = null;
    var componentsList = [];
    var currentComponents = {};

    var currentLayoutName;
    var currentPageName;

    var $UserSettings = new nkf.core.UserSettings();
    var $NetworkManager = new nkf.core.network.NetworkManager();
    var $Utils = nkf.core.Utils;
    var $StorageManager = nkf.core.storage.StorageManager.getInstance();

    var originalStrings = null;

    var languageCache = {};
  }

  makeSingleton(ComponentManager);

  $.extend(self, {
    ComponentManager: ComponentManager
  });

})();
