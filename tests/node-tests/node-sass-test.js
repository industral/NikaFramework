var sass = require('node-sass');
var mocha = require('mocha');
var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

describe('node-sass', function() {
  var source = null;

  before(function(done, fail) {
    fs.readFile(path.resolve(__dirname, 'test.scss'), function(err, contents) {
      source = contents.toString(); 
      done();
    });
  });

  it('Should be a proper object', function() {
    expect(sass).to.be.a('object');
    expect(sass.render).to.be.a('function');
  });

  it('Should compile simple example', function(done) {
    sass.render(source, function(err, css) {
      expect(css).to.contain('color: #f0f0f0;');
      done();
    });
  });
});
