(function() {
  "use strict";

  nkf.core.Utils.initClass(nkf.core.components.component.WidgetAbstract, Controls, "Controls");

  function Controls() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.Constructor = function() {
    };

    this.getRenderedDOM = function() {
      return domComponent;
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    function constructor() {
      addEventListeners();
    }

    function addEventListeners() {
      domComponent.find("button").click(function() {
        $.cookie("isLogin", null, {path: "/"});

        window.location.reload();
      });
    }

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var domComponent = this._getComponent();

    constructor();
  }

})();
