var OrderDetialService = angular.module('OrderDetialService',[]);

OrderDetialService.service('orderDetialService',['homeService', 'postService', '$location', '$timeout', function  (homeService, postService, $location, $timeout) {

	//ods orderDetialService
	var ods = this
	ods.getOrderDetial = function() {
		// if can not get orderDetail go back to login page

		if(homeService.orderDetail == undefined){
			
			$location.path( "/tab/home" );
		
		}else{
			// $evalAsync(function() {
   //  $scope.position =$ionicScrollDelegate.getScrollView(). __scrollTop;
        // });
		ods.orderDetail = homeService.orderDetail
		console.log(homeService.orderDetail)
		ods.oid = ods.orderDetail.oid
		ods.items = homeService.orderDetail.items
		}

	};
	
	
	

		

	ods.confirmOrder = function  () {
	 	
		ods.itemsId = []

	 	ods.confirmData = {}
	 	
 		_.forEach(ods.items, function(item, key) { 
 			console.log(item); 
 			ods.itemsId.push({
 	           ds_id: item.ds_id,
 	           otid: item.otid
 	        })
 	      
 		});
 		
	 	ods.confirmData.token = window.localStorage.getItem("sv_token"); 
	 	
	 	ods.confirmData.rid = window.localStorage.getItem("sv_rid"); 
	 	
	 	ods.confirmData.oid = ods.oid;

	 	ods.confirmData.items = ods.itemsId;

	 	ods.confirmData.task = 0;

	 	ods.confirmData.test = 'test';
	 	// $cordovaProgress.showBarWithLabel(true, 30000, "获取订单中");
	 	ods.url ='handle'

	 	postService.post(ods.confirmData, ods.url).then(function() {

	 		 if (postService.response.result == 0){
	 		 	
	 		  	ods.response = postService.response
	 			
	 			console.log(ods.response)
	 			
	 			// $timeout(function() {
	 			//          $location.path( "/tab/orderDetial" );
	 			//     }, 3000);

	 		 } else{
	 		 	console.log(postService.response.error_msg)
	 		 	
	 		 	// 	$timeout(function() {
	 			//          // $cordovaProgress.showText(true, "订单获取失败: " + postService.result.error_msg , 'center')
	 			//     }, 3000);
	 			// $timeout(function() {
	 			//          // $cordovaProgress.hide()
	 			//     }, 6000);
	 		 }
	 	})
	}

	

	


}])