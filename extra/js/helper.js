function extendClass(extendClass, superClass) {
  extendClass.prototype = new superClass();
  extendClass.prototype.superClass = function() {
    return extendClass.prototype;
  }
}

function makeSingleton(clazz) {
  clazz.getInstance = function() {
    if (!clazz.instance) {
      clazz.instance = new clazz();
    }

    return clazz.instance;
  };
}
