(function() {
  "use strict";

  var ns = "nkf.core.components.component";
  var self = $.namespace(ns);

  extendClass(WidgetAbstract, nkf.core.components.ComponentAbstract);
  WidgetAbstract.className = "WidgetAbstract";

  function WidgetAbstract() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.className = WidgetAbstract.className;

    this.render = function(params) {
      var dom = this.getRenderedDOM();

      params.dom.append(dom);

      return dom;
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

  }

  $.extend(self, {
    WidgetAbstract: WidgetAbstract
  });

})();
