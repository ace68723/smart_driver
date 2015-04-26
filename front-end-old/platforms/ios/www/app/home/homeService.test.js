var HomeService = angular.module('HomeService',["firebase"]);

HomeService.service('homeService',['postService','$timeout','$location','$firebase', function  (postService, $timeout, $location,$firebase) {
	// hs HomeService
	var hs = this;
	// var url = "cm-rrclient-1"
	var folder = "0"
	var url = "cm-restaurant"
	hs.FBURL = "https://" + url + ".firebaseio.com/restaurant/" + folder

	// var ref = new Firebase("https://" + url + ".firebaseio.com/rrclient/" + folder)
	hs.ref = new Firebase(hs.FBURL)

	var sync = $firebase(hs.ref);

	hs.syncNewItem = $firebase(hs.ref.child("new"))
	hs.newItem = hs.syncNewItem.$asObject();



	hs.syncDoneItem = $firebase(hs.ref.child("done"))
	hs.doneItem = hs.syncDoneItem.$asObject();

	hs.user = {};
	hs.postService = postService;

	// hs.test = "hi"
	
	hs.getOrderDetail = function  (oid) {
		
		hs.orderInfo = {}
		

		hs.orderInfo.token = window.localStorage.getItem("sv_token"); 
		hs.orderInfo.rid = window.localStorage.getItem("sv_rid"); 
		hs.orderInfo.oid = oid;

		// $cordovaProgress.showBarWithLabel(true, 30000, "获取订单中");
		hs.url ='orderdetail/'

		hs.postService.post(hs.orderInfo, hs.url).then(function() {

			 if (postService.response.result == 0){
			 	
			  	hs.orderDetail = postService.response
				
				console.log(hs.orderDetail)
				
				$timeout(function() {
				         $location.path( "/tab/orderDetial" );
				    }, 3000);

			 } else{
			 	console.log(postService.response.error_msg)
			 	
			 	$timeout(function() {
				         // $cordovaProgress.showText(true, "订单获取失败: " + postService.result.error_msg , 'center')
				    }, 3000);
				$timeout(function() {
				         // $cordovaProgress.hide()
				    }, 6000);
			 }
		})
	}

}])