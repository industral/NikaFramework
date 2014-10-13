(function() {
  "use strict";

  var self = nkf.core.components;

  Component.className = "Component";

  function Component() {

    // --------------------------------------------------------------------
    // Public methods
    // --------------------------------------------------------------------

    this.className = Component.className;

    this.render = function() {
      console.error("This method doesn't redefined");
    };

    this.identificate = function(dynamic) {
      var dom = this.getDOM();

      dom.setAttribute(nkf.conf.def.attr.component.name, this.constructor.className);
      dom.setAttribute(nkf.conf.def.attr.component.type, utils.getComponentType(this));
      dom.setAttribute(nkf.conf.def.attr.component.dynamic, dynamic);
    };

    this.getDOM = function() {
      console.error("This method doesn't redefined");
    };

    this.getTemplate = function(data) {
      data = data || {};
      var resultObj = {};

      Object.assign(resultObj, {
        componentType: utils.getComponentType(this),
        componentName: this.constructor.className,
        wrap: false
      }, data);

      return utils.getComponentPart(resultObj);
    };

    this.getData = function(data) {
      var requestedComponent = this;

      var screenData = $ComponentManager.getData();
      var result = null;

      if (data && data.all) {
        result = screenData;
      } else {
        var componentType = data && data.componentType || utils.getComponentType(this);
        var componentName = data && data.componentName || this.constructor.className;

        result = screenData && screenData.components && screenData.components[componentType] && screenData.components[componentType][componentName] || {};
      }

      if (data && data.callback) {
        if (!nkf.core.utils.getObjectSize(result)) {
          console.debug("Load additional resources");

          nkf.core.Controller.load({
            init: true,
            noRedraw: function() {
              var requestObj = Object.assign({}, data, true);
              delete requestObj.callback;

              data.callback(requestedComponent.getData(requestObj));
            }
          });
        } else {
          data.callback(result);
        }
      } else {
        return result;
      }
    };

    this._localize = function(data) {
      $ComponentManager.localize(data);
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    var _this = this;
    var utils = nkf.core.utils;
    var $ComponentManager = nkf.core.components.ComponentManager.getInstance();
  }

  Object.assign(self, {
    Component: Component
  });

})();
