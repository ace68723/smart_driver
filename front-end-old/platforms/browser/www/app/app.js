// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [ 'ionic',
                            'ngCordova', 
                            'starter.controllers', 
                            'starter.services', 
                            'LoginCtrl',
                            'LoginService',
                            'HomeCtrl',
                            'HomeService',
                            'OrderDetialCtrl',
                            'OrderDetialService',

                            'PostService'])

.run(function($ionicPlatform, $rootScope, $cordovaSplashscreen,$timeout) {


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    $rootScope.showLogin = true;
    $timeout(function() {
       $cordovaSplashscreen.hide();
       $rootScope.showLogin = true;
    }, 1000);
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }



  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
   .state('login', {
    url: '/login',
    templateUrl: 'app/login/login.tpl.html',
    controller: 'loginCtrl as lc'
  })
   
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "app/tabs.tpl.html"
  })

  // Each tab has its own nav history stack:


 

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'app/home/home.tpl.html',
        controller: 'homeCtrl as hc'
      }
    }
  })

  .state('tab.oderDetial', {
    url: '/orderDetial/:orderId',
    views: {
      'tab-home': {
        templateUrl: 'app/orderDetial/orderDetial.tpl.html',
        controller: 'orderDetialCtrl as od'
      }
    }
  })



  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
