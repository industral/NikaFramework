(function() {
  "use strict";

  var ns = "nkf.impl.components.layout";
  var self = $.namespace(ns);

  extendClass(LoggedIn, nkf.core.components.component.LayoutAbstract);
  LoggedIn.className = "LoggedIn";

  function LoggedIn() {

    // --------------------------------------------------------------------
    // Public methods/properties
    // --------------------------------------------------------------------

    this.className = LoggedIn.className;

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
    LoggedIn: LoggedIn
  });

})();
