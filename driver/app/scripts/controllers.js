'use strict';
angular.module('SmartDriver.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http,API_URL) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
    var token = localStorage.getItem("token");
  // Triggered in the login modal to close it
  
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

    $timeout(function() {
        if(!token){
          $scope.login(); 
        }
    }, 1000);
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

        $http.post(API_URL + 'driver_login', $scope.loginData).
          success(function(data, status, headers, config) {
            $scope.closeLogin();
          }).
          error(function(data, status, headers, config) {
            console.log(data)
          });
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    // $timeout(function() {
      
    // }, 1000);
  }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
