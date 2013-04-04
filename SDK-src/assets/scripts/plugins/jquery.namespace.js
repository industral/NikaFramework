/*
 * http://www.zachleat.com/web/2007/08/28/namespacing-outside-of-the-yahoo-namespace/
 */
"use strict";

$.namespace = function() {
  var a = arguments, o = null, i, j, d;
  for (i = 0; i < a.length; i = i + 1) {
    d = a[i].split(".");
    o = window;
    for (j = 0; j < d.length; j = j + 1) {
      o[d[j]] = o[d[j]] || {};
      o = o[d[j]];
    }
  }
  return o;
};

$.lnamespace = function(ns, data) {
  var d = ns.split(".");
  var o = {};
  var tmp = o;

  for (var i = 0; i < d.length; ++i) {
    if (data && i === d.length - 1) {
      tmp[d[i]] = data;
    } else {
      tmp = tmp[d[i]] = {};
    }
  }

  return o;
};
