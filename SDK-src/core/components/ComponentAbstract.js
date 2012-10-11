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

    this.setState = function(data) {
      var dom = this.getRenderedDOM();

      if ($Utils.getComponentType(this) !== nkf.enumType.Component.component) {
        dom = dom.parent();
      }

      var attrObj = {};
      attrObj[nkf.conf.def.attr.state] = data.state;
      attrObj["data-state-effect"] = data["state-effect"];

      dom.attr(attrObj);

      if (!data.isSilent) {
        var resultObj = {};

        var passedObj = {
          type: nkf.def.events.type.is,
          name: nkf.def.component.action.state,
          data: {
            state: data.state
          }
        };

        $.extend(resultObj, data, passedObj);

        $(document).trigger($Utils.getComponentNS(this), resultObj);
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
        componentName: this.className,
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
        var componentName = data && data.componentName || this.className;

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
