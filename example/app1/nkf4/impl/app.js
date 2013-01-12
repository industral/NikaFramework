$(function() {
  console.log(1);
  nkf.conf.usePageLoadStandardBehaviour = false;

  var url = "/" + nkf.core.Controller.getCurrentPath();
  history.replaceState({path: url, init: true}, "", url);

  $(document).trigger("nkf.core.Controller", {
    type: nkf.def.events.type.make,
    name: "load",
    data: {
      init: true,
      appInit: true
    }
  });
});
