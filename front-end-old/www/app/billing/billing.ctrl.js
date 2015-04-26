var BillingCtrl = angular.module('BillingCtrl',[]);

BillingCtrl.controller('billingCtrl',['billingService', function  (billingService) {
	
	// lc loginCtrl
	var bc = this;
	
	// console.log("billingCtrl")

	billingService.getBilling()	
    
}])