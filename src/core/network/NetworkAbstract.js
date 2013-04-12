(function() {
  "use strict";

  var ns = "nkf.core.network";
  var self = $.namespace(ns);

  function NetworkAbstract() {

    this.get = function() {
      console.warn("Please redefine this method");
    }

  }

  $.extend(self, {
    NetworkAbstract: NetworkAbstract
  });

})();
