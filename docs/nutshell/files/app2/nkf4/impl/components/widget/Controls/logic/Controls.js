(function() {
  "use strict";

  var ns = "nkf.impl.components.widget";
  var self = $.namespace(ns);

  extendClass(Controls, nkf.core.components.component.WidgetAbstract);
  Controls.className = "Controls";

  function Controls() {

    // --------------------------------------------------------------------
    // Public methods/variables
    // --------------------------------------------------------------------

    this.className = Controls.className;

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

    var _this = this;

    var $ComponentManager = nkf.core.components.ComponentManager.getInstance();

    var domComponent = this._getComponent();

    constructor();
  }

  $.extend(self, {
    Controls: Controls
  });

})();
