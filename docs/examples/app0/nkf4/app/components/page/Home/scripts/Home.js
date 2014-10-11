(function() {
  "use strict";

  nkf.core.Utils.extend(nkf.core.components.component.Page, Home, "Home");

  function Home() {

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
