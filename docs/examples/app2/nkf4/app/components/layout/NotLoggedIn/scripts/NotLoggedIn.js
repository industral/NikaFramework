(function() {
  "use strict";

  nkf.core.Utils.extend(nkf.core.components.component.Layout, NotLoggedIn, "NotLoggedIn");

  function NotLoggedIn() {

    // --------------------------------------------------------------------
    // Public methods/properties
    // --------------------------------------------------------------------

    this.Constructor = function() {
    };

    this.getDOM = function() {
      return domComponent;
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var domComponent = this.getTemplate();
  }

})();
