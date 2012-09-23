(function() {
  "use strict";

  var ns = "nkf.core.storage";
  var self = $.namespace(ns);

  MemoryStorage.prototype = new self.StorageAbstract();

  function MemoryStorage() {
    this.getData = function(key) {
      var storedData = nkf.storage;

      return $Utils.getObjectValueByKey(storedData, key);
    };

    this.setData = function(path, data) {
      var storedData = this.getData();

      if (path) {
        var pathNS = $.lnamespace(path, data);
        $.extend(true, storedData, pathNS);
      } else {
        storedData = data;
      }

      nkf.storage = storedData;
    };

    this.clear = function() {
      nkf.storage = {};
    };

    this.initStructure = function() {
    };

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var $Utils = nkf.core.Utils;
  }

  $.extend(self, {
    MemoryStorage: MemoryStorage
  });

})();
