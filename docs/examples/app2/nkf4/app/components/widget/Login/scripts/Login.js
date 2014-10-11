(function() {
  "use strict";

  nkf.core.Utils.extend(nkf.core.components.component.WidgetAbstract, Login, "Login");

  // --------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------

  function Login() {

    this.Constructor = function() {
      init();
    };

    this.getDOM = function() {
      return domComponent;
    };

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

          nkf.core.Controller.load({
            init: true
          });
        } else {
          alert("Please enter login and password!");
        }

      });
    }

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var domComponent = this.getTemplate();
  }

})();
