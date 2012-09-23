(function() {
  "use strict";

  var ns = "nkf.core.components.component";
  var self = $.namespace(ns);

  extendClass(ComponentAbstract, nkf.core.components.ComponentAbstract);
  ComponentAbstract.className = "ComponentAbstract";

  function ComponentAbstract() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.className = ComponentAbstract.className;

    this.wrapDOM = function(dom) {
      if (!dom.is("[{componentType}]".format({
        componentType: nkf.conf.def.attr.component.type
      }))) {
        var obj = {};
        obj[nkf.conf.def.attr.component.name] = this.className;
        obj[nkf.conf.def.attr.component.type] = nkf.enumType.Component.component;

        dom.attr(obj);
      }
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------
  }

  $.extend(self, {
    ComponentAbstract: ComponentAbstract
  });

})();
