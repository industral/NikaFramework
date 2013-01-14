nkf.conf.useLogin = true; // if you are planning to use authorization at framework
nkf.conf.defaultLoggedInPage = "Home";
nkf.conf.defaultNotLoggedInPage = "NotLoggedIn";

nkf.conf.defaultLoggedInLayout = "LoggedIn";
nkf.conf.defaultNotLoggedInLayout = "NotLoggedIn";

nkf.conf.usePageLoadStandardBehaviour = true; // if set to true, will fetch from /data/page/PAGE_NAME.json
nkf.conf.pageURL = "/data/pages"; // where stored JSON data
nkf.conf.pageNameExtension = "json"; // page extenstion for JSON data, for example for page Home Home.json
nkf.conf.loadingMaskSelector = "#page-loading-mask";
