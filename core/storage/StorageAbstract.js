(function() {
  "use strict";

  var ns = "nkf.core.storage";
  var self = $.namespace(ns);

  function StorageAbstract() {

    this.getData = function() {
      console.warn("Please redefine this method!");
    };

    this.setData = function() {
      console.warn("Please redefine this method!");
    };

    this.clear = function() {
      console.warn("Please redefine this method!");
    };

    this.initStructure = function() {
      console.warn("Please redefine this method!");
    }
  }

  $.extend(self, {
    StorageAbstract: StorageAbstract
  });

})();
