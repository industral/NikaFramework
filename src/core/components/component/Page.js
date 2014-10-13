(function() {
  "use strict";

  nkf.core.utils.extend(nkf.core.components.Component, Page, "Page");

  function Page() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.render = function(params) {
      var dom = this.getDOM();

      dom.setAttribute(nkf.conf.def.attr.component.type, nkf.enumType.Component.page);
      dom.setAttribute(nkf.conf.def.attr.component.name, this.constructor.className);

      if (params.dom) {
        var section = params.dom.querySelector(nkf.conf.render.layout.selector);

        if (section) {
          section.innerHTML = ''; //TODO: check memory leaks
          section.appendChild(dom);
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
