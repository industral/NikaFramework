// Simple testrunner.
// Currently only perf tests supported.
// Async tests aren't supported.
;(function(ns) {

  var tests = {};
  var performanceTests = {};

  var level = 0;

  function runNTimes(fn, times) {
    var i = 0;
    for (; i < times; i++) {
      fn();
    }
  }

  function runTests() {
    var descs = Object.keys(tests);
    var i = 0, l = descs.length;
    for (; i < l; i++) {
      console.log('Running "', descs[i], '"');
      level++;
      tests[descs[i]]();
      level--;
    }
  }

  function runPerfTests() {
    var descs = Object.keys(performanceTests);
    var i = 0, l = descs.length;
    for (l; i < l; i++) {
      var now = Date.now();
      runNTimes(performanceTests[descs[i]], 1000);
      console.log('Test "', descs[i], '" runned 1000 times and take', Date.now() - now, 'ms to run');
    }
  }

  ns.runAll = function() {
    runTests();
    runPerfTests();
  };

  ns.addTest = function(desc, fn) {
    tests[desc] = fn;
  };

  ns.addPerformanceTest = function(desc, fn) {
    performanceTests[desc] = fn;
  };

  ns.assertTrue = function(exp, desc) {
    var spaces = (new Array(level)).join(' ');
    console.log(spaces, desc, '--', exp ? 'PASSED' : 'FAILED');
  };
})(window.TSpec = {});
