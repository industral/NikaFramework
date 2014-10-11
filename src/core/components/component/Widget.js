(function() {
  "use strict";

  nkf.core.Utils.extend(nkf.core.components.Component, Widget, "Widget");

  function Widget() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.render = function(params) {
      /*
       params.dom - <div data-nkf-component-type="widget" data-nkf-component-name="WIDGET_NAME">
       */

      var dom = $(this.getDOM());

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
