$(function() {
  nkf.conf.usePageLoadStandardBehaviour = false;

  $(document).trigger("nkf.core.Controller", {
    type: nkf.def.events.type.make,
    name: "load",
    data: {
      init: true,
      appInit: true
    }
  });
});
