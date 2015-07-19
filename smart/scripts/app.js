'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('smartApp', ['ionic', 'config','google-maps','ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $rootScope.showLogin = true;
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  
  //add token to headers
  $httpProvider.interceptors.push('authInterceptor');
  
  $stateProvider


    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl as lc'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:


    .state('tab.placeOrder', {
      url: '/placeOrder',
      views: {
        'tab-placeOrder': {
          templateUrl: 'templates/tab-placeOrder.html',
          controller: 'PlaceOrderCtrl as poc'
        }
      }
    })

    .state('tab.summary', {
      url: '/summary',
      views: {
        'tab-summary': {
          templateUrl: 'templates/tab-summary.html',
          controller: 'SummaryCtrl as sc'
        }
      }
    });
   

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/placeOrder');

})
.constant('API_URL', 'http://ajaxmart.ca:3001/')//api url constant
  
//add token to headers2
.service('authInterceptor',  function(authToken){

  function addToken (config) {
    var token = authToken.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }

  return{
    request: addToken
  }
  
});


