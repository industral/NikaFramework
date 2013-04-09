describe('Utils', function() {
  describe('#template', function() {
    var Utils = nkf.core.Utils;

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

    var passStr = '<p>Test passed!</p>';
    var wrongKeyStr = '<p>##non.existent.key##</p>';

    var passElement = null;
    var simpleElement = null;
    var failElement = null;

    beforeEach(function() {
      passElement = $('<p>##an.obj.with.non.trivial.structure##</p>');
      simpleElement = $('<p>##simple##</p>');
      failElement = $(wrongKeyStr);
    });

    it('Should be a function', function() {
      expect(Utils.template).to.be.a('function');
    });

    it('Should correctly compile templates with simple keys', function() {
      Utils.template(simpleElement, params);
      expect(simpleElement.html()).to.be.equal(passStr);
    });

    it('Should correctly compile non-trivial keys', function() {
      Utils.template(passElement, params);
      expect(passElement.html()).to.be.equal(passStr);
    });

    it('Should left non-existend keys in place', function() {
      Utils.template(failElement, params);
      expect(failElement.html()).to.be.equal(wrongKeyStr);
    });

    // TODO: add some tests for incorrect input

  });
});
