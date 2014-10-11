(function() {
  "use strict";

  var ns = "nkf.core.components";
  var self = $.namespace(ns);

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
      var dom = $(this.getDOM());

      var obj = {};
      obj[nkf.conf.def.attr.component.name] = this.constructor.className;
      obj[nkf.conf.def.attr.component.type] = $Utils.getComponentType(this);
      obj[nkf.conf.def.attr.component.dynamic] = dynamic;

      dom.attr(obj);
    };

    this.getDOM = function() {
      console.error("This method doesn't redefined");
    };

    this.getTemplate = function(data) {
      data = data || {};
      var resultObj = {};

      $.extend(resultObj, {
        componentType: $Utils.getComponentType(this),
        componentName: this.constructor.className,
        wrap: false
      }, data);

      return $Utils.getComponentPart(resultObj);
    };

    this.getData = function(data) {
      var requestedComponent = this;

      var screenData = $ComponentManager.getData();
      var result = null;

      if (data && data.all) {
        result = screenData;
      } else {
        var componentType = data && data.componentType || $Utils.getComponentType(this);
        var componentName = data && data.componentName || this.constructor.className;

        result = screenData && screenData.components && screenData.components[componentType] && screenData.components[componentType][componentName] || {};
      }

      if (data && data.callback) {
        if (!nkf.core.Utils.getObjectSize(result)) {
          console.debug("Load additional resources");

          nkf.core.Controller.load({
            init: true,
            noRedraw: function() {
              var requestObj = $.extend({}, data, true);
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
    var $Utils = nkf.core.Utils;
    var $ComponentManager = nkf.core.components.ComponentManager.getInstance();
  }

  $.extend(self, {
    Component: Component
  });

})();
