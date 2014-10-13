(function() {
  "use strict";

  // Andy Zhupanov
  nkf.core.utils.template = function(template, obj) {
    var html = template[0].outerHTML;

    return html.replace(/##[\w\.]+?##/g, function(matched) {
      var chunks = matched.slice(2, -2).split('.');
      var root = obj;
      var i = 0;
      var chunk;

      while ((chunk = chunks[i++]) && root != null) {
        root = root[chunk] || null;
      }

      return root || matched;
    });
  };

  nkf.core.utils.getComponentPart = function(data) {
    //todo: html?
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

    var componentData = window[nkf.conf.render[data.componentPart]][pathToComponentPart];

    if (componentData) {
      if (data.componentPart === nkf.enumType.Data.svg) {
        return self.Utils.parseSVG(componentData);
      } else if (data.componentPart === nkf.enumType.Data.xml) {
        return $($.parseXML(componentData)).contents();
      } else if (data.componentPart === nkf.enumType.Data.data) {
        return JSON.parse(componentData);
      } else {
        var o = document.createElement("div");
        o.innerHTML = componentData;

        return data.wrap ? componentData : o.childNodes[0];
      }
    } else {
      console.warn(pathToComponentPart, "doesn't exist");
    }
  };

  nkf.core.utils.getComponentType = function(instance) {
    switch (true) {
      case instance instanceof nkf.core.components.component.Layout:
        return nkf.enumType.Component.layout;
        break;
      case instance instanceof nkf.core.components.component.Page:
        return nkf.enumType.Component.page;
        break;
      case instance instanceof nkf.core.components.component.Widget:
        return nkf.enumType.Component.widget;
        break;
      case instance instanceof nkf.core.components.component.Component:
        return nkf.enumType.Component.component;
        break;
      case instance instanceof nkf.core.components.component.Context:
        return nkf.enumType.Component.context;
        break;
      default:
        console.warn("Looks like using wrong instance", instance);
    }
  };

  nkf.core.utils.parseSVG = function(string) {
    var svg = new DOMParser().parseFromString(string, "text/xml");

    return $(document.importNode(svg.documentElement, true));
  };

  nkf.core.utils.getComponentNS = function(component) {
    var resultComponent = "{componentType}.{componentName}".format({
      componentType: Utils.getComponentType(component),
      componentName: component.className
    });

    return resultComponent;
  };

  nkf.core.utils.getComponentNSByDOM = function(element) {
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

  nkf.core.utils.getComponentByNS = function(ns) {
    return eval("nkf.impl.components." + ns);
  };

  nkf.core.utils.getComponentInstanceByNS = function(ns) {
    var split = ns.split(/\.|#/);

    var type = split[0];
    var name = split[1];
    var id = split[2];

    var selector;
    if (id) {
      selector = "[data-nkf-component-type={type}][data-nkf-component-name={name}][data-nkf-component-id={id}]]".format({
        type: type,
        name: name,
        id: id
      });
    } else {
      selector = "[data-nkf-component-type={type}][data-nkf-component-name={name}]".format({
        type: type,
        name: name
      });
    }

    return document.querySelector(selector);
  };

  nkf.core.utils.firstLetterUpperCase = function(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  };

  nkf.core.utils.getObjectValueByKey = function(object, path) {
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

  nkf.core.utils.setObjectValueByKey = function(object, path, keyValue) {
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

  nkf.core.utils.prepareURLObject = function(data) {
    if (data && Object.keys(data).length) {
      var keys = Object.keys(data);

      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = data[key];

        if (typeof value === "object" && value && value._custom) {
          if (value.isDelete) {
            delete data[key];
          } else {
            data[key] = value.value;
          }
        } else if (value === null) {
          delete data[key];
        }
      }
      return data;
    }
  };

  nkf.core.utils.getSerializeObject = function(data) {
    var string = JSON.stringify(data);

    if (string) {
      return string.replace(/"(\w+)"\s*:/g, "$1:");
    } else {
      return "";
    }
  };

  nkf.core.utils.getDeserializedObject = function(data) {
    if (data) {
      var string = decodeURIComponent(data);
      string = string.replace(/(\w+)\s*:/g, '"$1":');

      try {
        return JSON.parse(string);
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  };


  //FIXME: Object.keys?
  nkf.core.utils.getObjectSize = function(data) {
    var count = 0;

    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        count++;
      }
    }

    return count;
  };

  nkf.core.utils.os = {};

  nkf.core.utils.os.win = navigator.platform.match(/win/i);
  nkf.core.utils.os.mac = navigator.platform.match(/mac/i);

  nkf.core.utils.extendClass = function(extendClass, superClass) {
    extendClass.prototype = new superClass();
    extendClass.prototype.constructor = extendClass;
  };


  nkf.core.utils.makeSingleton = function(clazz) {
    clazz.getInstance = function() {
      if (!clazz.instance) {
        clazz.instance = new clazz();
      }

      return clazz.instance;
    };
  };

  nkf.core.utils.extend = function(type, clazz, className) {
    var ns;

    switch (true) {
      case type == nkf.core.components.component.Layout:
        ns = nkf.impl.components.layout;
        break;
      case type == nkf.core.components.component.Page:
        ns = nkf.impl.components.page;
        break;
      case type == nkf.core.components.component.Widget:
        ns = nkf.impl.components.widget;
        break;
      case type == nkf.core.components.component.Context:
        ns = nkf.impl.components.context;
        break;
      case type == nkf.core.components.component.Component:
        ns = nkf.impl.components.component;
        break;
      case type == nkf.core.components.Component:
        ns = nkf.core.components.component;
        break;
      default:
        console.warn("Looks like using wrong instance", type);
    }

    nkf.core.utils.extendClass(clazz, type);
    clazz.className = className;

    var o = {};
    o[className] = clazz;

    Object.assign(ns, o);

    return o;
  };

})();
