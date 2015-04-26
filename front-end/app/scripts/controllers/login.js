'use strict';

/**
 * @ngdoc function
 * @name smartApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the smartApp
 */
angular.module('smartApp')
	.controller('LoginCtrl', function (loginService,authToken,$location) {
	    var lc = this;

	    lc.login = function(username, password) {
	    	loginService.login(username,password).then(function success(response) {

	    		lc.user.username = response.data.username;
	    		
	    		console.log(response);
	    		$location.path( "/tab/placeOrder" );


	    	}, lc.handleError)
	    };
	    lc.logout = function() {
	    	loginService.logout();
	    };

	    lc.handleError = function(response) {
	    	alert('Error: ' + response.data);
	    };
	})

  	.service('loginService', ['$http','API_URL', 'authToken', 'userData',
  		function($http, API_URL, authToken, userData){

  			function login(username,password) {
  				return $http.post(API_URL + 'login/',{
  					username: username,
  					password: password
  				}).then(function success (response) {
  					authToken.setToken(response.data.token);
  					userData.setUserData(response.data.lat,response.data.lng,response.data.uid)
  					return response;
  				});
  			};

  			function logout () {
  				//set token to nothing
  				authToken.setToken();
  			}

  			return{
  				login: login,
  				logout: logout
  			}
  			
  		}])

  	.service('authToken', function($window){
  			
  			var store = $window.localStorage;
  			var key_token = 'sv_token'

  			function getToken () {
  				return store.getItem(key_token);
  			}

  			function setToken (token) {
  				
  				if(token){
  					store.setItem(key_token,token);
  				}else{
  					store.removeItem(key_token);
  				}
  			}

  			return{
  				getToken: getToken,
  				setToken: setToken
  			};
  		})
  	.service('userData', function($window){
  			
  			var store = $window.localStorage;
  			var key_lat = 'sv_lat';
  			var key_lng = 'sv_lng';
  			var key_uid = 'sv_uid';

  			function getUserData () {
  				
  				userData = {};
  				userData.lat = store.getItem(key_lat);
  				uerData.lng = store.getItem(key_lng);
  				uerData.uid = store.getItem(key_uid);
  				return userData;
  			}

  			function setUserData (lat,lng,uid) {
  				
  				if(lat && lng && uid){
  					store.setItem(key_lat,lat);
  					store.setItem(key_lng,lng);
  					store.setItem(key_uid,uid);

  				}else{
  					store.removeItem(key_lat);
  					store.removeItem(key_lng);  					
  					store.removeItem(key_uid);  					
  				}
  			}

  			return{
  				getUserData: getUserData,
  				setUserData: setUserData
  			};
  		});
