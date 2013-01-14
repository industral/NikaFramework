(function() {
  "use strict";

  var ns = "nkf.impl.components.page";
  var self = $.namespace(ns);

  extendClass(Home, nkf.core.components.component.PageAbstract);
  Home.className = "Home";

  function Home() {

    // --------------------------------------------------------------------
    // Public methods/properties
    // --------------------------------------------------------------------

    this.className = Home.className;

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

  $.extend(self, {
    Home: Home
  });

})();
