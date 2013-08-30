(function() {
  "use strict";

  var ns = "nkf.core.network";
  var self = $.namespace(ns);

  NetworkOnline.prototype = new self.NetworkAbstract();

  function NetworkOnline() {
//    init();

    this.get = function(param) {
      return $.ajax(param);
    };

    function init() {
      $.ajaxSetup({
        dataType: "json",
        statusCode: {
          200: function(data) {
//            console.debug(data);
          },
          404: function(data) {
            console.warn("page not found");
          }
        }
      });
    }
  }

  $.extend(self, {
    NetworkOnline: NetworkOnline
  });

})();
