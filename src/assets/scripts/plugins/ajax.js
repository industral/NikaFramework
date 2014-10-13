/**
 * Ajax util class.
 *
 * @param {Object} options
 * @property {Object} [options.method=GET] HTTP request method
 * @property {Object} options.url URL
 * @property {Object} options.data parameters
 * @property {Function} options.success callback function for success response
 * @property {Function} options.error callback function for error response
 *
 * @constructor
 */
nkf.core.Ajax = function(options) {
  options = options || {};
  options.dataType = options.dataType || "json";

  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState === 4) {

      var data = null;

      if (options.dataType === "json") {
        try {
          data = JSON.parse(request.responseText);
        } catch (e) {
        }
      } else {

        data = request.responseText;
      }

      if (request.status === 200) {
        if (options.success) {
          options.success(data);
        }
      } else {
        if (options.error) {
          options.error(data);
        }
      }

      if (options.always) {
        options.always(data, request);
      }
    }
  };

  options.method = (options.method || "GET").toLowerCase();
  var formData;

  if (options.method !== "get") {
    if (options.form) {
      formData = new FormData(options.form);
    }

    if (options.data) {
      if (!formData) {
        formData = new FormData();
      }

      Object.keys(options.data).forEach(function(key) {
        formData.append(key, options.data[key]);
      });
    }
  } else {
    if (options.data) {
      var output = [];

      Object.keys(options.data).forEach(function(key, index) {
        output.push(encodeURIComponent(key) + "=" + encodeURIComponent(options.data[key]));
      });

      var qs = output.join("&");

      if (qs) {
        options.url += "?" + qs;
      }
    }
  }

  request.open(options.method, options.url, true);
  request.send(formData);
};
