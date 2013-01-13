$(function() {
  $(document).trigger("nkf.core.Controller", {
    type: nkf.def.events.type.make,
    name: "load",
    data: {
      init: true
    }
  });
});
