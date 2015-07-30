module.exports = function(config) {

  config.set({

    basePath: './',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine-jquery', 'jasmine', 'chai'],
    reporters: ['spec', 'coverage', 'coveralls'],

    preprocessors: {
      'lib/*.js': ['coverage']
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    files: [
      'node_modules/jquery/dist/jquery.js',
      'lib/vorton.js',
      {
        pattern: 'spec/fixtures/*.html',
        watched: true,
        included: false,
        served: true
      },
      'spec/.dist/**/*.spec.js',
    ],
    exclude: [],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false

  });

};
