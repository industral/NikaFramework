$(function() {
  nkf.conf.pageURL = "/app1" + nkf.conf.pageURL;

  $(document).trigger("nkf.core.Controller", {
    type: nkf.def.events.type.make,
    name: "load",
    data: {
      init: true,
      appInit: true
    }
  });
});
