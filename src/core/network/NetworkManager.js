(function() {
  "use strict";

  var ns = "nkf.core.network";
  var self = $.namespace(ns);

  function NetworkManager() {

    this.get = function(param) {
      //TODO: just for testing...
      var networkInstance = new self.NetworkOnline();
      networkInstance.get(param);
    }
  }

  $.extend(self, {
    NetworkManager: NetworkManager
  });

})();
