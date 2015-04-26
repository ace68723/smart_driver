var OrderDetialCtrl = angular.module('OrderDetialCtrl',[]);

OrderDetialCtrl.controller('orderDetialCtrl',[ 'orderDetialService','homeService','$timeout', function  (orderDetialService, homeService, $timeout ) {
	// od OrderDetial
	var od = this;

	var ods = orderDetialService;
	
	ods.getOrderDetial();

	od.orderDetail = ods.orderDetail;

	// console.log(od.orderDetail)
	
	$timeout(function() {
    	od.showList = true 
    }, 500);

	od.refuseItem = function(ds_id, otid) {
		// console.log(ds_id)
		// console.log(otid)
		// ods.refuseItem(ds_id, otid)
		// od.refuse = true
		
		od.refuse = 0

		_.forEach(od.orderDetail.items, function(item, key) { 
			// console.log(item)
			// console.log(item.refuse == true)
 			if (item.refuse == true) {
 				od.refuse = 1
 			}
	    })
 	    // console.log(od.orderDetail)
 	     // console.log(od.refuse)
 		
	};

	//task 0 accept order; task 1 refuse order
	od.confirmOrder = function(task) {
		ods.confirmOrder(task, od.orderDetail.items)
	};

}])