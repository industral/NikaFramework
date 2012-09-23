(function() {
  "use strict";

  var ns = "nkf.core.storage";
  var self = $.namespace(ns);

  CookieStorage.prototype = new self.StorageAbstract();

  function CookieStorage() {
  }

  $.extend(self, {
    CookieStorage: CookieStorage
  });

})();
