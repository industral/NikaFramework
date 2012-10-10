(function() {
  "use strict";

  var ns = "nkf.core.storage";
  var self = $.namespace(ns);

  LocalStorage.prototype = new self.StorageAbstract();

  function LocalStorage() {
    this.getData = function(key) {
      var storedData = JSON.parse(localStorage.getItem(nkf.conf.storage.key));

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

      localStorage.setItem(nkf.conf.storage.key, JSON.stringify(storedData));
    };

    this.clear = function() {
      localStorage.clear();
    };

    this.initStructure = function() {

    };

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var $Utils = nkf.core.Utils;
  }

  $.extend(self, {
    LocalStorage: LocalStorage
  });

})();
