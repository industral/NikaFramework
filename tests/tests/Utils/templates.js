;(function() {
  'use strict';
  
  // some shortcuts
  var assertTrue = TSpec.assertTrue;
  var Utils = nkf.core.Utils;

  var resStr = '<p>Test passed!</p>';
  var wrongKeyStr = '<p>##non.existent.key##</p>';

  var params = {
    'an': {
      'obj': {
        'with': {
          'non': {
            'trivial': {
              'structure': 'Test passed!'
            }
          }
        }
      }
    },
    'simple': 'Test passed!'
  };

  function createPassElement() {
    return $('<p>##an.obj.with.non.trivial.structure##</p>');
  }
  function simpleEl() {
    return $('<p>##simple##</p>');
  }
  function createFailElement() {
    return $(wrongKeyStr);
  }

  TSpec.addTest('Utils.template tests', function() {
    var passEl = createPassElement();
    var sEl = simpleEl();
    var failEl = createFailElement();
    Utils.template(passEl, params);
    Utils.template(failEl, params);
    Utils.template(sEl, params);
    assertTrue(sEl.html() == resStr, 'Should handle simple data');
    assertTrue(passEl.html() == resStr, 'Should replace values correctly fro non-trivial keys');
    assertTrue(failEl.html() == wrongKeyStr, 'Should leave non-existent keys in string');
  });
  TSpec.addTest('Utils.template2 tests', function() {
    var passEl = createPassElement();
    var sEl = simpleEl();
    var failEl = createFailElement();
    Utils.template2(sEl, params);
    Utils.template2(passEl, params);
    Utils.template2(failEl, params);
    assertTrue(sEl.html() == resStr, 'Should handle simple data');
    assertTrue(passEl.html() == resStr, 'Should replace values correctly fro non-trivial keys');
    assertTrue(failEl.html() == wrongKeyStr, 'Should leave non-existent keys in string');
  });
  TSpec.addPerformanceTest('Utils.template perf test', function() {
    var passEl = createPassElement();
    return Utils.template(passEl, params);
  });

  TSpec.addPerformanceTest('Utils.template2 perf test', function() {
    var passEl = createPassElement();
    return Utils.template2(passEl, params);
  });



})();
