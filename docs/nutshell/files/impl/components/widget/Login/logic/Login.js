(function() {
  "use strict";

  var ns = "nkf.impl.components.widget";
  var self = $.namespace(ns);

  extendClass(Login, nkf.core.components.component.WidgetAbstract);
  Login.className = "Login";

  // --------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------

  function Login() {
    this.className = Login.className;

    this.getRenderedDOM = function() {
      return domComponent;
    };

    function constructor() {
      init();
    }

    function init() {
      addEventListener();
    }

    function addEventListener() {
      domComponent.find(":submit").click(function(e) {
        e.preventDefault();

        var username = domComponent.find("#login").val().trim();
        var password = domComponent.find("#password").val().trim();

        if (username && password) {
          //Do login, if any credentials were entered
          $.cookie("isLogin", true, {path: "/"});

          $(document).trigger("nkf.core.Controller", {
            type: nkf.def.events.type.make,
            name: "load",
            data: {
              init: true
            }
          });
        } else {
          alert("Please enter login and password!");
        }

      });
    }

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var _this = this;

    var domComponent = this._getComponent();

    var $ComponentManager = nkf.core.components.ComponentManager.getInstance();

    constructor.call(this);
  }

  $.extend(self, {
    Login: Login
  });

})();
