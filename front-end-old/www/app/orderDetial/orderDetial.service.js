var OrderDetialService = angular.module('OrderDetialService',[]);

OrderDetialService.service('orderDetialService',['homeService', 'postService', '$location', '$timeout','$cordovaProgress', function  (homeService, postService, $location, $timeout, $cordovaProgress) {

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
	
	ods.refuseItemList = []

	ods.refuseItem = function(ds_id, otid) {
		// console.log(ds_id)
		// console.log(otid)
		ods.refuseItemList.push({
 	           ds_id: ds_id,
 	           otid: otid
        })
        console.log(ods.refuseItemList)
	};
	

		
	//task 0 accept order; task 1 refuse order
	ods.confirmOrder = function  (task, refuseItemList) {
	 	
		ods.itemsId = []

	 	ods.confirmData = {}
	 	
	 	if (task == 0) {
 			_.forEach(ods.items, function(item, key) { 
 				console.log(item); 
 				ods.itemsId.push({
 		           ds_id: item.ds_id,
 		           otid: item.otid
 		        })
 			});

			if (window.cordova) {
	       		$cordovaProgress.showBarWithLabel(true, 30000, "确认接单中");
	      	}
 		 	  

	 	}else if (task ==1){
	 		_.forEach(refuseItemList, function(item, key) { 
	 			if (item.refuse == true) {
	 				ods.itemsId.push({
	 		           ds_id: item.ds_id,
	 		           otid: item.otid
	 		        })
	 			}
		    })
			
			if (window.cordova) {
	      		$cordovaProgress.showBarWithLabel(true, 30000, "订单打回中");
	      	}
		    
		    
	 	}else{
	 		return
	 	}
 		
 		
	 	ods.confirmData.token = window.localStorage.getItem("sv_token"); 
	 	
	 	ods.confirmData.rid = window.localStorage.getItem("sv_rid"); 
	 	
	 	ods.confirmData.oid = ods.oid;

	 	ods.confirmData.items = ods.itemsId;

	 	ods.confirmData.task = task;

	 	ods.url ='handle'

	 	postService.post(ods.confirmData, ods.url).then(function() {


	 		 if (postService.response.result == 0){
	 		 	
	 		  	ods.response = postService.response
	 			
	 			console.log(ods.response)
	 			
	 			$timeout(function() {
					if (window.cordova) {
			      		$cordovaProgress.showSuccess(true, "提交成功")
			      	}
	 			          
	 			}, 3000);
 				$timeout(function() {
 					
 					if (window.cordova) {
			      		$cordovaProgress.hide()
			      	}
	 			         
 			    }, 5000);

	 			$timeout(function() {
	 			         $location.path( "/tab/home" );
	 			}, 6000);

	 		 } else{
	 		 	console.log(postService.response.error_msg)
	 		 	
	 		 		$timeout(function() {
	 			        if (window.cordova) {
				      		$cordovaProgress.showText(true, "提交失败: " + postService.response.error_msg , 'center')
				      	}
	 			          
	 			    }, 3000);
	 				$timeout(function() {
	 					if (window.cordova) {
				      		$cordovaProgress.hide()
				      	}
	 			         
	 			    }, 6000);
	 		 }
	 	})
	}

	

	


}])