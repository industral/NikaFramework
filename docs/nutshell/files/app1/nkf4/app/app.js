$(function() {
  nkf.conf.URLSuffix = "/app1";
  nkf.conf.useLogin = false;
  nkf.conf.localization = false;

  nkf.core.Controller.load({
    init: true
  });
});
