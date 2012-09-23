(function() {
  "use strict";

  var ns = "nkf.core.components.component";
  var self = $.namespace(ns);

  extendClass(PageAbstract, nkf.core.components.ComponentAbstract);
  PageAbstract.className = "PageAbstract";

  function PageAbstract() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.className = PageAbstract.className;

    this.render = function(params) {
      var dom = this.getRenderedDOM();

      var attr = {};
      attr[nkf.conf.def.attr.component.type] = nkf.enumType.Component.page;
      attr[nkf.conf.def.attr.component.name] = this.className;

      dom.attr(attr);

      params.dom ? $(nkf.conf.render.layout.selector, params.dom).append(dom) : $ComponentManager.setPreRenderedDOM(dom);

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

  $.extend(self, {
    PageAbstract: PageAbstract
  });

})();
