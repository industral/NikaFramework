(function() {
  "use strict";

  var ns = "nkf.core.storage";
  var self = $.namespace(ns);

  nkf.def.SettingsComponent = {
    preferences: {},
    currentPage: "index"
  };

  nkf.def.SettingsData = $.extend(true, nkf.def.Component, nkf.def.SettingsComponent);

  nkf.def.StorageComponent = {};
  nkf.def.StorageComponent.UserSettings = $.extend(true, {}, nkf.def.SettingsData);
  nkf.def.StorageComponent.NetworkData = {};

  function StorageManager() {
    checkAbility();

    this.getData = function(key) {
      return storageInstance.getData(key);
    };

    this.setData = function(path, data) {
      storageInstance.setData(path, data);
    };

    this.initStructure = function() {
      storageInstance.initStructure();

      if (!StorageManager.instance.getData()) {
        StorageManager.instance.setData(null, $.extend(true, {}, nkf.def.StorageComponent));
      }
    };

    this.clear = function() {
      storageInstance.clear();
    };

    // --------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------

    function checkAbility() {
//      if (window.localStorage && window.localStorage.getItem) {
//        storageInstance = new self.LocalStorage();
//      } else {
        storageInstance = new self.MemoryStorage();
//      }
    }

    // --------------------------------------------------------------------
    // Private variables
    // --------------------------------------------------------------------

    var $Utils = nkf.core.Utils;
  }

  StorageManager.instance = null;

  StorageManager.getInstance = function() {
    if (StorageManager.instance === null) {
      StorageManager.instance = new StorageManager();
    }

    StorageManager.instance.initStructure();

    return StorageManager.instance;
  };

  $.extend(self, {
    StorageManager: StorageManager
  });

  var storageInstance = null;

})();
