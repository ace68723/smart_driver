var PlaceOrderService = angular.module('PlaceOrderService',['google-maps']);

PlaceOrderService.service('placeOrderService',['postService','$q', '$timeout', '$location','$cordovaProgress','$cordovaDialogs', function  (postService, $q, $timeout, $location, $cordovaProgress, $cordovaDialogs) {
	
	// lc loginCtrl
	var pos = this;

	var distance = new google.maps.DistanceMatrixService();
	
	var geocoder = new google.maps.Geocoder();



	// pos.getDistance = function() {

	
		
	// 	var request = {
	// 	  origins: ['43.808971 -79.289955'],
	// 	  destinations: [pos.destination],
	// 	  travelMode: google.maps.TravelMode.DRIVING,
	// 	  unitSystem: google.maps.UnitSystem.METRIC,
	// 	  avoidHighways: false,
	// 	  avoidTolls: false
	// 	};

	// 	distance.getDistanceMatrix(request, function (response, status) {
	// 	  if (status === google.maps.DistanceMatrixStatus.OK) {
		    
	// 	    console.log(response);
	// 	    // console.log(response.routes[0].legs[0].distance);
	// 	    // // console.log(response.routes[0].legs[0].duration);
	// 	    // $scope.distance = response.routes[0].legs[0].distance;
	// 	    // $scope.duration = response.routes[0].legs[0].duration;
	// 	  } else {
	// 	    console.log(response)
	// 	    // alert('Google route unsuccesfull!');
	// 	  }
	// 	});	

	// };

	pos.getCodeAddress = function(destination) {

		pos.destination = destination

		var request = { 'address' : pos.destination};

		return $q(function(resolve, reject) {
		    
		    geocoder.geocode(request, function(results, status) {
		    	if (status == google.maps.GeocoderStatus.OK) {
	    	     	
	         		console.log(results);
	    			
	    			resolve({
	    			  'formattedAddress': results[0].formatted_address,
	    			  'lat': results[0].geometry.location.k,
	    			  'lng': results[0].geometry.location.D
	    			});
		    	
		    	} else {
		    		
		    		console.log(status)
		    	    
		    	    
		    	    reject({
		    	      rejectedData: status
		    	    });
		    	}
		    });
		    
	    });

	};

	pos.getDistance = function (origins, destinations) {
	  // console.log(origins)
	  // console.log(end)
	  var request = {
	    origins: origins,
	    destinations: destinations,
	    travelMode: google.maps.TravelMode.DRIVING,
	    unitSystem: google.maps.UnitSystem.METRIC,
	    avoidHighways: false,
	    avoidTolls: false
	  };
	  	return $q(function(resolve, reject) {
	  	    
			distance.getDistanceMatrix(request, function (response, status) {
			    if (status === google.maps.DistanceMatrixStatus.OK) {
			      
			      console.log(response);
			      // console.log(response.routes[0].legs[0].distance);
			      // // console.log(response.routes[0].legs[0].duration);
			      // $scope.distance = response.routes[0].legs[0].distance;
			      // $scope.duration = response.routes[0].legs[0].duration;
			      	resolve({
	    			  'destinationAddresses':response.destinationAddresses
	    			});
			    } else {
			      	
			      	console.log(response)
			       	
			       	reject({
		    	    	rejectedData: status
		    	    });
			      // alert('Google route unsuccesfull!');
			    }
			});
	  	    
	     });


	}
	pos.areaCheck = function(lat, lng) {
		pos.data = {}
		pos.url = 'areacheck/'

		pos.data.token = window.localStorage.getItem("sv_token"); 
		pos.data.rid =  window.localStorage.getItem("sv_rid"); 
		pos.data.lat = lat;
		pos.data.lng = lng;

		

		return $q(function(resolve, reject) {
				
				postService.post(pos.data, pos.url).then(function() {

					pos.response = postService.response;

					console.log(pos.response)

					 if (pos.response.result == 0){
					 	if(pos.response.area == 3){
					 		$cordovaDialogs.alert('订单超出运送范围', '抱歉', '确认')
					 	}else{
			 				resolve({
			 		    			  'response': pos.response
			 		    			});

					 	}
						
					 } else{
					 	pos.error_msg = pos.response.error_msg
					 	
					 	reject({
					 	  'error_msg': pos.error_msg
					 	});
					 }
				})

		    
	    });
	}
	
	pos.orderSubmit = function(orderData) {
		
		if (window.cordova) {
			$cordovaProgress.showBarWithLabel(true, 30000, "Order Submitting");			     	
					     	
	    }

		pos.url = 'ordersubmit/'

		return $q(function(resolve, reject) {
				
				postService.post(orderData, pos.url).then(function() {

					pos.response = postService.response;

					console.log(pos.response)

					 if (pos.response.result == 0){

					 	
						resolve({
				    			  'response': pos.response
				    			});

						if (window.cordova) {
					     	
				     	 	$timeout(function() {
				     		       
				     		    	$cordovaDialogs.alert('下单成功,感谢您使用馋猫订餐', '单号:' + pos.response.oid , '确认')
	       					     	.then(function() {
	       					     	   $location.path( "/tab/home" );
	       					     	});

				     		    }, 3000);
					     	
					    }

					 } else{
					 	pos.error_msg = pos.response.error_msg
					 	
					 	reject({
					 	  'error_msg': pos.error_msg
					 	});

						if (window.cordova) {
					     	
					     	
				     	 // 	$timeout(function() {
				     		//          $cordovaProgress.showText(true, "提交失败: " + pos.error_msg , 'center')
				     		//     }, 3000);
				     		// $timeout(function() {
				     		//         $cordovaProgress.hide()
				     		//     }, 6000);

						//for test
						$timeout(function() {
				     		       
				     		    	$cordovaDialogs.alert('Order Submit Succeeded', 'Order No.513', 'Confirm')
	       					     	.then(function() {
	       					     	   $location.path( "/tab/summary" );
	       					     	});

				     		    }, 3000);
					    }
					 }
				})

		    
	    });
	}
}])