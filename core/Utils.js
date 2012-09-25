(function() {
  "use strict";

  var ns = "nkf.core";
  var self = $.namespace(ns);

  function Utils() {
  }

  Utils.getComponentPart = function(data) {
    data.componentPart = data.componentPart ? data.componentPart : "html";

    var pathToComponentPart = "{componentsPath}/{componentType}/{componentName}/{componentPartPath}/{componentPartName}.{componentPartSuffix}";
    pathToComponentPart = pathToComponentPart.format({
      componentsPath: nkf.conf.components,
      componentType: data.componentType,
      componentName: data.componentName,
      componentPartPath: nkf.conf.def[data.componentPart].path,
      componentPartName: data.componentPartName || nkf.conf.def[data.componentPart].name,
      componentPartSuffix: nkf.conf.def[data.componentPart].suffix
    });

    var componentData = eval(nkf.conf.render[nkf.conf.def[data.componentPart].path])[pathToComponentPart];

    if (componentData) {
      if (data.componentPart === nkf.enumType.Data.svg) {
        return self.Utils.parseSVG(componentData);
      } else if (data.componentPart === nkf.enumType.Data.xml) {
        return $($.parseXML(componentData)).contents();
      } else if (data.componentPart === nkf.enumType.Data.data) {
        return JSON.parse(componentData);
      } else {
        return data.wrap ? $(componentData) : componentData;
      }
    } else {
      console.warn(pathToComponentPart, "doesn't exist");
    }
  };

  Utils.getComponentType = function(instance) {
    switch (true) {
      case instance instanceof nkf.core.components.component.LayoutAbstract:
        return nkf.enumType.Component.layout;
        break;
      case instance instanceof nkf.core.components.component.PageAbstract:
        return nkf.enumType.Component.page;
        break;
      case instance instanceof nkf.core.components.component.WidgetAbstract:
        return nkf.enumType.Component.widget;
        break;
      case instance instanceof nkf.core.components.component.ComponentAbstract:
        return nkf.enumType.Component.component;
        break;
      default:
        console.warn("Looks like using wrong instance", instance);
    }
  };

  Utils.parseSVG = function(string) {
    var svg = new DOMParser().parseFromString(string, "text/xml");

    return $(document.importNode(svg.documentElement, true));
  };

  Utils.getComponentNS = function(component) {
    var resultComponent = "{componentType}.{componentName}".format({
      componentType: Utils.getComponentType(component),
      componentName: component.className
    });

    return resultComponent;
  };

  Utils.getComponentNSByDOM = function(element) {
    var selector = "[{componentTypeKey}={componentTypeName}]".format({
      componentTypeKey: nkf.conf.def.attr.component.type,
      componentTypeName: nkf.enumType.Component.widget
    });

    if (!element.is(selector)) {
      element = element.parents(selector);
    }

    var componentType = element.attr(nkf.conf.def.attr.component.type);
    var componentName = element.attr(nkf.conf.def.attr.component.name);

    var result = "{componentType}.{componentName}".format({
      componentType: componentType,
      componentName: componentName
    });

    return result;
  };

  Utils.getComponentByNS = function(ns) {
    return eval("nkf.impl.components." + ns);
  };

  Utils.firstLetterUpperCase = function(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  };

  Utils.getObjectValueByKey = function(object, path) {
    function process(node) {
      return result[node];
    }

    if (path) {
      var pathsNode = path.split(".");

      var result = object;

      pathsNode.forEach(function(value, key) {
        if (result) {
          result = process(value);
        }
      });

      return result;
    }

    return object;
  };

  Utils.setObjectValueByKey = function(object, path, keyValue) {
    function process(o, node, last) {
      last ? (res[node] = keyValue) : (res[node] = res[node] || {});
      return res[node];
    }

    if (path) {
      var res = object;
      var pathsNode = path.split(".");

      var t;
      for (var i = 0; i < pathsNode.length; ++i) {
        var value = pathsNode[i];

        t = value;
        res = process(object, value, (i + 1 >= pathsNode.length));
      }
    } else {
      console.error("Please specify a path");
    }
  };

  Utils.prepareURLObject = function(data) {
    if (data && Utils.getObjectSize(data)) {
      $.each(data, function(key, value) {
        if (typeof value === "object" && value._custom) {
          if (value.isDelete) {
            delete data[key];
          } else {
            data[key] = value.value;
          }
        }
      });

      return data;
    }
  };

  Utils.getSerializeObject = function(data) {
    var string = JSON.stringify(data);

    if (string) {
      return string.replace(/"(\w+)"\s*:/g, "$1:");
    } else {
      return "";
    }
  };

  Utils.getDeserializedObject = function(data) {
    if (data) {
      var string = data.replace(/(\w+)\s*:/g, '"$1":');
      return JSON.parse(string);
    } else {
      return {};
    }
  };

  Utils.getObjectSize = function(data) {
    var count = 0;

    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        count++;
      }
    }

    return count;
  };

  $.extend(self, {
    Utils: Utils
  });

})();
