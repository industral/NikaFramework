String.prototype.format = function (args) {
  var newStr = this;
  for (var key in args) {
    newStr = newStr.replace(new RegExp("{" + key + "}","g"), args[key]);
  }
  return newStr;
};
