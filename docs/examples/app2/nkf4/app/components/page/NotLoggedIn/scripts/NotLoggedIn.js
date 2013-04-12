(function() {
  "use strict";

  nkf.core.Utils.initClass(nkf.core.components.component.PageAbstract, NotLoggedIn, "NotLoggedIn");

  function NotLoggedIn() {

    // --------------------------------------------------------------------
    // Public methods/properties
    // --------------------------------------------------------------------

    this.Constructor = function() {
    };

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

})();
