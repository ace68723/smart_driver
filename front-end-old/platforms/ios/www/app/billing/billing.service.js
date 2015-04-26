var BillingService = angular.module('BillingService',[]);

BillingService.service('billingService',['postService','$cordovaProgress','$timeout','$location', function  (postService, $cordovaProgress, $timeout, $location) {

	var bs = this

	bs.getBilling = function  (user) {
		//console.log(user);

		// $cordovaProgress.showBarWithLabel(true, 30000, "登陆中");
		bs.url ='billing/'
		
		bs.data = {};

		bs.data.token = window.localStorage.getItem("sv_token"); 
		bs.data.rid =  window.localStorage.getItem("sv_rid"); 

		postService.post(bs.data, bs.url).then(function() {
			 // console.log(postService.result)
			 bs.response = postService.response;

			if ( bs.response.result == 0){
			 	  console.log(bs.response.result)

				
				$timeout(function() {
				         // $cordovaProgress.showSuccess(true, "登陆成功")
				    }, 3000);
				$timeout(function() {
				        // $cordovaProgress.hide()
				 
				       
				    }, 4000);

			 } else{
			 	
			 	console.log( bs.response.error_msg)
			 	
			 	bs.error_msg = bs.response.error_msg
			 	
			 	$timeout(function() {
				         // $cordovaProgress.showText(true, "登陆失败: " + bs.error_msg , 'center')
				    }, 3000);
				$timeout(function() {
				        // $cordovaProgress.hide()
				    }, 6000);
			 }
		})
	}



}])