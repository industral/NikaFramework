(function() {
  "use strict";

  var ns = "nkf.impl.components.layout";
  var self = $.namespace(ns);

  extendClass(NotLoggedIn, nkf.core.components.component.LayoutAbstract);
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

    function constructor() {
      init.call(this);
    }

    function init() {
    }

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var domComponent = this._getComponent();

    constructor.call(this);
  }

  $.extend(self, {
    NotLoggedIn: NotLoggedIn
  });

})();
