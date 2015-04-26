var HomeCtrl = angular.module('HomeCtrl',[]);

HomeCtrl.controller('homeCtrl',['loginService', 'homeService', '$timeout',function  (loginService, homeService, $timeout) {
	// hc homeCtrl
	var hc = this;
	hc.newItem = homeService.newItem
	// console.log(hc.newItem)

	hc.doneItem = homeService.doneItem
	// console.log(hc.doneItem)

	$timeout(function() {
    	hc.showList = true 
    }, 800);

	hc.getOrderDetail = function(oid) {
		homeService.getOrderDetail(oid)
	};

	hc.logout = function() {
	  loginService.logout() 
	}
}])