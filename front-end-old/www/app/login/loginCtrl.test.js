var LoginCtrl = angular.module('LoginCtrl',[]);

LoginCtrl.controller('loginCtrl',['loginService', function  (loginService) {
	// lc loginCtrl
	var lc = this;
	lc.user = {};
	
    

	if(window.localStorage.getItem("sv_token") != null){
		 loginService.checkToken()
	} 
	
	
	
	
	
	lc.submit = function  (user) {
		loginService.submit(user)
	}

	lc.logout = function() {
	  	window.localStorage.removeItem("sv_uid");
		window.localStorage.removeItem('sv_rid');
		window.localStorage.removeItem('sv_token');

	};
}])