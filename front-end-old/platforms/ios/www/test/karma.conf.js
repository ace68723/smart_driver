module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      './lib/angular/angular.js',
      './lib/angular-route/angular-route.js',
      './lib/angular-mocks/angular-mocks.js',
      './lib/mockfirebase/browser/mockfirebase.js',
      './lib/angularfire/dist/angularfire.js',
      './test/lib/**/*.js',
       './app/*/*.spec.js', 
       './app/*/*.test.js',
       './app/login/*.test.js'

    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};