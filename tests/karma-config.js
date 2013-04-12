basePath = '../';

files = [
  MOCHA,
  MOCHA_ADAPTER,
  'nkf.js',
  'components/expect/expect.js',
  'tests/test-config.js',
  { pattern: 'tests/spec/**/*.js', included: true, served: true, watched: true }
];

port = 8081;

reporters = ['progress'];

// Possible values: Chrome, ChromeCanary, Firefox, IE (Windows Only), Safari (Mac Only)
browsers = ['PhantomJS'];
