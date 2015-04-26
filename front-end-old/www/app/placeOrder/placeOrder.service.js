var PlaceOrderService = angular.module('PlaceOrderService',['google-maps']);

PlaceOrderService.service('placeOrderService',['postService','$q', '$timeout', '$location','$cordovaProgress','$cordovaDialogs','$ionicPopup', 
	function  (postService, $q, $timeout, $location, $cordovaProgress, $cordovaDialogs,$ionicPopup) {
	
	// lc loginCtrl
	var pos = this;

	var distance = new google.maps.DistanceMatrixService();
	
	var geocoder = new google.maps.Geocoder();

	// init addresses array
	pos.addresses_array = [];

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

	pos.getAddresses = 	function() {
		return $q(function(resolve, reject) {
			postService.get('get_addresses')
			.then(function() {
				pos.addresses = postService.response.addresses
				resolve({
		    			  'addresses': pos.addresses
		    			});
			},function(error) {
				reject({
					 	  'error': 'error'
				});
			})

		})
	};

	pos.addresses_array = [];
	pos.getDistance = function (origins, destinations) {
	  console.log(origins)
	   // console.log(destinations)
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

			      	var origin_addresses = response.originAddresses;
			    	var destination_addresses = response.destinationAddresses;
			    	var rows = response.rows;




			    	_.forEach(origins, function(origin, key) {
			    		var row = key
			    		_.forEach(destinations, function(destination, key){
			    			var duration = rows[row].elements[key].duration.value;
			    			var distance = rows[row].elements[key].distance.value;
			    			
			    			pos.addresses_array.push({
			    				start 	: origin,
			    				end		: destination,
			    				duration: duration,
			    				distance: distance

			    			})
			    		})
			    	})
			    	// send pos.addresses_array when user tap order button

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
	
	pos.preorderSubmit = function(preorderData,submitData) {
		
		//add address array 
		preorderData.array = pos.addresses_array;
		if (window.cordova) {
			$cordovaProgress.showBarWithLabel(true, 30000, "Order Submitting");			     	
					     	
	    }

		pos.url = 'preorder/'

		return $q(function(resolve, reject) {
				
				postService.post(preorderData, pos.url).then(function() {

					pos.response = postService.response;

					console.log(pos.response)

					 if (pos.response.result == 0){
					 	

					 	var confirmPopup = $ionicPopup.confirm({
					 	    title	: pos.response.msg,
					 	    template: 'Time:' + pos.response.wait + ' Total:' + pos.response.charge
					 	  });
					 	  confirmPopup.then(function(res) {
					 	    if(res) {
					 	    	pos.order_url = 'order/';
					 	    	postService.post(submitData, pos.order_url).then(function() {
					 	    		pos.response = postService.response;

					 	    		if (pos.response.result == 0) {
					 	    			
					 	    			// init addresses array
					 	    			pos.addresses_array = [];
			 	    					
			 	    					resolve({
			 	    			    		'response': pos.response
			 	    			    	});
					 	    		} else{
					 	    			pos.error_msg = pos.response.error_msg
					 	    			
					 	    			reject({
					 	    			  'error_msg': pos.error_msg
					 	    			});
					 	    		};
					 	    	})
					 	    } else {
					 	      reject({
					 	        'error_msg': 'cancel'
					 	      });
					 	    }
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