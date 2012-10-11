String.prototype.format = function (args) {
  var newStr = this;
  for (var key in args) {
    newStr = newStr.replace('{' + key + '}', args[key]);
  }
  return newStr;
};