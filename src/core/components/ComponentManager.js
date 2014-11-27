(function() {
  "use strict";

  var self = nkf.core.components;
  var ns = "nkf.core.components";

  ComponentManager.className = "ComponentManager";

  function ComponentManager() {
    this.className = ComponentManager.className;

    constructor();

    this.load = function(data) {
      //$(document).off(".nkfRemove");

      if (preRenderedDOM) {
        var components = preRenderedDOM.querySelectorAll("section [data-nkf-component-type='widget']");

        for (var i = 0; i < components.length; ++i) {
          var componentEl = components[i];

          var componentName = componentEl.getAttribute("data-nkf-component-name");

          delete nkf.instances.widget[componentName];
        }
      }


      getData(data);
    };

    this.getData = function(params) {
      return pageData;
    };

    //TODO: replace data and params with params
    this.setData = function(data, params) {
      var type = (params && params.type) || utils.getComponentType(this);

      pageData = pageData || {};
      pageData.components = pageData.components || {};

      pageData.components[type] = pageData.components[type] || {};
      var currentData = pageData.components[type][(params && params.className) || this.constructor.className];

      var resultData = Object.assign({}, currentData, data);

      pageData.components[type][(params && params.className) || this.constructor.className] = resultData;
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

    this.localize = function(object) {
      _this.localize({
        lang: object.lang
      });
    };

    this.getPageName = function(name) {
      var defaultPage = document.querySelector("[data-nkf-default-page]");
      return name || defaultPage && defaultPage.getAttribute("data-nkf-default-page") || nkf.conf.defaultPage;
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

        nkf.emit("nkf.core.components.ComponentManager", {
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

    function renderScreen(data) {
      if (nkf.impl.components.context) {
        var contextEls = Object.keys(nkf.impl.components.context);

        if (contextEls.length) {
          nkf.instances.context = {};

          for (var i = 0; i < contextEls.length; ++i) {
            var key = contextEls[i];
            var value = nkf.impl.components.context[key];

            var component = value.getInstance ? value.getInstance() : new value();

            if (component.Constructor && !component.isConstructed) {
              component.Constructor();
              component.isConstructed = true;
            }

            nkf.instances.context[key] = component;
          }
        }
      }

      document.body.dataset.status = "loading";

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

      if (nkf.conf.localization) {
        _this.localize({
          lang: nkf.core.utils.cookie("lang") || document.body.getAttribute("data-nkf-lang") || "en"
        });
      }

      nkf.emit(ns + "." + ComponentManager.className, {
        name: "preAppend"
      });

      if (!document.querySelectorAll("body > [data-nkf-component-type=layout]").length) {
        document.querySelector(nkf.conf.render.body.selector).appendChild(preRenderedDOM);
      }

      nkf.emit(ns + "." + ComponentManager.className, {
        name: "appended"
      });

      //$.each(componentsList, function(key, value) {
      //  var component = utils.getComponentNS(value);
      //
      //  nkf.emit(component, {
      //    name: "rendered"
      //  });
      //});

      nkf.emit(ns + "." + ComponentManager.className, {
        name: "rendered"
      });

      document.body.dataset.status = "loaded";
    }

    function postRenderScreen() {
      for (var i = 0; i < componentsList.length; ++i) {
        var postInit = componentsList[i].postInit;

        if (postInit) {
          postInit();
        }
      }
    }

    function checkIncludedComponents(params) {
      var componentSelector = "[{component}]:not([data-nkf-component-dynamic=true])".format({
        component: nkf.conf.def.attr.component.type
      });

      var els = params.dom.querySelectorAll(componentSelector);

      if (els && els.length) {
        for (var i = 0; i < els.length; ++i) {
          var dom = els[i];

          //$.each($(params.dom).find(componentSelector), function(key, value) {
          //  var dom = $(value);

          var componentType = dom.getAttribute(nkf.conf.def.attr.component.type);
          var componentName = dom.getAttribute(nkf.conf.def.attr.component.name);
          var componentClass = utils.getComponentByNS("{componentType}.{componentName}".format({
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

          //});
        }
      }
    }

    function getData(params) {
      var layoutName = document.querySelector("[data-nkf-component-type=layout]").getAttribute("data-nkf-component-name");
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
        nkf.emit(ns + "." + ComponentManager.className, {
          name: "dataFetched",
          data: {
            pageName: pageName,
            data: data
          }
        });

        renderScreen(currentComponents);
      }

      var el = (document.body).querySelector(nkf.conf.loadingMaskSelector);
      if (el) {
        el.classList.remove(nkf.conf.classes.none);
      }

      //TODO: option to not load data
      //TODO: option to add additional params
      //TODO: option to add custom pageName for URL
      //TODO: [conf] option for extension
      var pageNameURL = nkf.conf.pageFormatter.format({
        pageURL: nkf.conf.URLSuffix + nkf.conf.pageURL,
        pageName: params.pageURLName || pageClass.className
      });

      if (nkf.conf.pageNameExtension) {
        pageNameURL += "." + nkf.conf.pageNameExtension;
      }

      nkf.core.Ajax({
        url: pageNameURL,
        data: params.params,
        method: params.type || "get",
        always: function(data, request) {
          var el = (document.body).querySelector(nkf.conf.loadingMaskSelector);
          if (el) {
            el.classList.add(nkf.conf.classes.none);
          }

          if (request.status >= 200 && request.status <= 401) {
            if (request.status >= 200 && request.status <= 302) {
              pageCode = request.status;

              pageData = Object.assign(true, {}, data);

              if (!params.noRedraw) {
                callback(pageData);
              } else {
                params.noRedraw();
              }
            } else if (pageCode !== request.status) {
              pageCode = request.status;

              _this.load({});
            } else {
              nkf.core.Controller.load({
                pageName: "Welcome",
                init: true,
                clear: true
              });
            }
          } else {
            if (nkf.pageError) {
              nkf.pageError(request);
            }
          }
        }
      });
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

      nkf.instances.layout[params.component.className] = component;

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

      nkf.instances.page[params.component.className] = component;

      params.dom.rendered = true;

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
      if (!params.dom.rendered) {
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

        nkf.instances.widget[params.component.className] = component;

        params.dom.rendered = true;

        var dom = component.render({
          dom: params.dom
        });

        componentsList.push(component);

        checkIncludedComponents({
          dom: dom,
          component: params.component
        });
      }
    };

    function constructor() {
      if (ComponentManager.instance) {
        console.error("Please use getInstance method instead of creating new instance");
      }
    }

    constructor.call(this);

    var _this = this;

    var pageData = {
      components: {}
    };

    var pageCode = 200;

    var currentLanguageName = "en";

    var preRenderedDOM = null;
    var componentsList = [];
    var currentComponents = {};

    var currentLayoutName;
    var currentPageName;

    var utils = nkf.core.utils;

    var originalStrings = null;

    var languageCache = {};
  }

  nkf.core.utils.makeSingleton(ComponentManager);

  Object.assign(self, {
    ComponentManager: ComponentManager
  });

})();
