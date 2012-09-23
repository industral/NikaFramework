/* http://stackoverflow.com/questions/2048720/get-all-attributes-from-a-html-element-with-javascript-jquery */

(function($) {
  $.fn.getAttributes = function() {
    var attributes = {};

    if(!this.length)
      return this;

    $.each(this[0].attributes, function(index, attr) {
      attributes[attr.name] = attr.value;
    });

    return attributes;
  }
})(jQuery);
