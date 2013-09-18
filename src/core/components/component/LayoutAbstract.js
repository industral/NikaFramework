(function() {
  "use strict";

  nkf.core.Utils.initClass(nkf.core.components.ComponentAbstract, LayoutAbstract, "LayoutAbstract");

  function LayoutAbstract() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.render = function(params) {
      var dom = this.getRenderedDOM();

      var attr = {};
      attr[nkf.conf.def.attr.component.type] = nkf.enumType.Component.layout;
      attr[nkf.conf.def.attr.component.name] = this.constructor.className;

      dom.attr(attr);

//      if ($ComponentManager.getPreRenderedDOM()) {
        var layout = $("body > [data-nkf-component-type=layout]");
        layout.remove();
        $(nkf.conf.render.body.selector).append(dom);
//      }


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
