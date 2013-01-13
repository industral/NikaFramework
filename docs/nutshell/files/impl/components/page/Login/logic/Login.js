(function() {
  "use strict";

  var ns = "nkf.impl.components.page";
  var self = $.namespace(ns);

  extendClass(Login, nkf.core.components.component.PageAbstract);
  Login.className = "Login";

  function Login() {

    // --------------------------------------------------------------------
    // Public methods/properties
    // --------------------------------------------------------------------

    this.className = Login.className;

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
    Login: Login
  });

})();
