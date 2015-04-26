var InformationCtrl = angular.module('InformationCtrl',[]);

InformationCtrl.controller('informationCtrl',['$timeout', function  ($timeout ) {
	// od OrderDetial
	var ic = this;
	
	$timeout(function() {
    	ic.showLogo = true 
    }, 500);

	$timeout(function() {
    	ic.showText = true 
    }, 1000);

    $timeout(function() {
    	ic.showTel = true 
    }, 1500);

    $timeout(function() {
    	ic.showSocial = true 
    }, 2000);


	

}])