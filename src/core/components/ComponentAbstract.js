(function() {
  "use strict";

  var ns = "nkf.core.components";
  var self = $.namespace(ns);

  ComponentAbstract.className = "ComponentAbstract";

  function ComponentAbstract() {

    // --------------------------------------------------------------------
    // Public methods
    // --------------------------------------------------------------------

    this.className = ComponentAbstract.className;

    this.render = function() {
      console.error("This method doesn't redefined");
    };

    this.wrapDOM = function(dom) {
      if (!dom.is("[{componentType}]".format({
        componentType: nkf.conf.def.attr.component.type
      }))) {
        var dom = this.getRenderedDOM();

        var obj = {};
        obj[nkf.conf.def.attr.component.name] = this.constructor.className;
        obj[nkf.conf.def.attr.component.type] = $Utils.getComponentType(this);

        dom.attr(obj);
      }
    };

    this.getRenderedDOM = function() {
      console.error("This method doesn't redefined");
    };

    this._getComponent = function(data) {
      data = data || {};
      var resultObj = {};

      $.extend(resultObj, {
        componentType: $Utils.getComponentType(this),
        componentName: this.constructor.className,
        wrap: true
      }, data);

      return $Utils.getComponentPart(resultObj);
    };

    this._getData = function(data) {
      var screenData = $ComponentManager.getData();

      if (data && data.all) {
        return screenData;
      } else {
        var componentType = data && data.componentType || $Utils.getComponentType(this);
        var componentName = data && data.componentName || this.constructor.className;

        return screenData && screenData.components && screenData.components[componentType] && screenData.components[componentType][componentName] || {};
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
    ComponentAbstract: ComponentAbstract
  });

})();
