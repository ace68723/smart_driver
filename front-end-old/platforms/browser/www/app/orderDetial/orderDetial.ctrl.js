var OrderDetialCtrl = angular.module('OrderDetialCtrl',[]);

OrderDetialCtrl.controller('orderDetialCtrl',[ 'orderDetialService','homeService', function  (orderDetialService,homeService) {
	// od OrderDetial
	var od = this;

	var ods = orderDetialService;
	
	ods.getOrderDetial();

	od.orderDetail = ods.orderDetail;

	console.log(od.orderDetail)

	od.confirmOrder = function() {
		ods.confirmOrder()
	};

}])