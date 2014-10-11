(function() {
  "use strict";

  nkf.core.Utils.extend(nkf.core.components.Component, Layout, "Layout");

  function Layout() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.render = function(params) {
      var dom = $(this.getDOM());

      var attr = {};
      attr[nkf.conf.def.attr.component.type] = nkf.enumType.Component.layout;
      attr[nkf.conf.def.attr.component.name] = this.constructor.className;

      dom.attr(attr);

      var layout = $("body > [data-nkf-component-type=layout]");
      layout.remove();
      $(nkf.conf.render.body.selector).append(dom);

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
