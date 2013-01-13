(function() {
  "use strict";

  var ns = "nkf.impl.components.page";
  var self = $.namespace(ns);

  extendClass(NotLoggedIn, nkf.core.components.component.PageAbstract);
  NotLoggedIn.className = "NotLoggedIn";

  function NotLoggedIn() {

    // --------------------------------------------------------------------
    // Public methods/properties
    // --------------------------------------------------------------------

    this.className = NotLoggedIn.className;

    this.getRenderedDOM = function() {
      return domComponent;
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var domComponent = this._getComponent();
  }

  $.extend(self, {
    NotLoggedIn: NotLoggedIn
  });

})();
