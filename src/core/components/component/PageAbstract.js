(function() {
  "use strict";

  nkf.core.Utils.initClass(nkf.core.components.ComponentAbstract, PageAbstract, "PageAbstract");

  function PageAbstract() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.render = function(params) {
      var dom = this.getRenderedDOM();

      var attr = {};
      attr[nkf.conf.def.attr.component.type] = nkf.enumType.Component.page;
      attr[nkf.conf.def.attr.component.name] = this.constructor.className;

      dom.attr(attr);

      if (params.dom) {
        var section = params.dom.find(nkf.conf.render.layout.selector);

        if (section.length) {
          section.contents().remove();
          section.append(dom);
        } else {
          console.warn("Render layout section not found");
        }
      } else {
        $ComponentManager.setPreRenderedDOM(dom);
      }

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
