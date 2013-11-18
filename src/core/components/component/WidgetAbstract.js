(function() {
  "use strict";

  nkf.core.Utils.initClass(nkf.core.components.ComponentAbstract, WidgetAbstract, "WidgetAbstract");

  function WidgetAbstract() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.render = function(params) {
      /*
       params.dom - <div data-nkf-component-type="widget" data-nkf-component-name="WIDGET_NAME">
       */

      var dom = this.getRenderedDOM();


//      if (dom.attr())

      params.dom.append(dom);

      params.dom.data({
        instance: this
      });

      return dom;
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

  }

})();
