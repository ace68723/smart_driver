var HomeCtrl = angular.module('HomeCtrl',[]);

HomeCtrl.controller('homeCtrl',['loginService', 'homeService', function  (loginService,homeService) {
	// hc homeCtrl
	var hc = this;
	hc.newItem = homeService.newItem
	// console.log(hc.newItem)

	hc.doneItem = homeService.doneItem
	// console.log(hc.doneItem)

	hc.getOrderDetail = function(oid) {
		homeService.getOrderDetail(oid)
	};

	hc.logout = function() {
	  loginService.logout() 
	}
}])