(function() {
  "use strict";

  var ns = "nkf.core";
  var self = $.namespace(ns);

  function UserSettings() {

    this.getSettings = function() {
//      return storageManager.getData(nkf.conf.storage.usersettings);
      return {};
    };

    this.setSettings = function() {

    };
  }

  $.extend(self, {
    UserSettings: UserSettings
  });

//  var storageManager = self.storage.StorageManager.getInstance();

})();
