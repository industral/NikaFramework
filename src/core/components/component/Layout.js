(function() {
  "use strict";

  nkf.core.utils.extend(nkf.core.components.Component, Layout, "Layout");

  function Layout() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.render = function(params) {
      var dom = this.getDOM();

      dom.setAttribute(nkf.conf.def.attr.component.type, nkf.enumType.Component.layout);
      dom.setAttribute(nkf.conf.def.attr.component.name, this.constructor.className);

      var layout = document.querySelector("body > [data-nkf-component-type=layout]");
      layout.parentNode.removeChild(layout);
      document.querySelector(nkf.conf.render.body.selector).appendChild(dom);

      $ComponentManager.setPreRenderedDOM(dom);

      return dom;
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var $ComponentManager = nkf.core.components.ComponentManager.getInstance();
  }

})();
