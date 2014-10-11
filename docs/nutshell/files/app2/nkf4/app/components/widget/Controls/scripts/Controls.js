(function() {
  "use strict";

  nkf.core.Utils.extend(nkf.core.components.component.WidgetAbstract, Controls, "Controls");

  function Controls() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.Constructor = function() {
    };

    this.getDOM = function() {
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

    var domComponent = this.getTemplate();

    constructor();
  }

})();
