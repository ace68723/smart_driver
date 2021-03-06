'use strict';

/*jshint -W099*/

angular.module('smartApp')
  	.controller('PlaceOrderCtrl', function (API_URL,$scope,$q,postService,$timeout,$ionicPopup,$location) {

  		var poc = this;

  		poc.areaCheckData = {};

  		poc.orderData = {};

//for address test
  	poc.areaCheckData.address = '2620 Kennedy Rd';

  	poc.areaCheckData.city = 'Scarborough';

  	poc.areaCheckData.postalCode = 'M1T 3H1';

  	poc.orderData.name = 'aiden';

  	poc.orderData.tel = '5197745881';

  	poc.orderData.apt = '515';

  	poc.orderData.buzz = '5126';

  	poc.orderData.price = '35.99';
//test address end

  	//disable native scroll when keyboard is opened
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.disableScroll(false);
		}

    	var distance = new google.maps.DistanceMatrixService();
    	
    	var geocoder = new google.maps.Geocoder();

   	// init addresses array
		poc.addresses_array = [];

		poc.getCodeAddress = function(destination) {
			poc.showError = null;

			poc.destination  = poc.areaCheckData.address + ', ' + poc.areaCheckData.city + ', ' + poc.areaCheckData.postalCode;
			// console.log(destination);

			var request = { 'address' : poc.destination};
				
			// call google api to get format address
			geocoder.geocode(request, function(results, status) {
		    	if (status === google.maps.GeocoderStatus.OK) {
	    	     	
	         	console.log(results);
	         	$scope.$apply(function () {
            			poc.cformatted_address 	= results[0].formatted_address;
            			poc.clat 				= results[0].geometry.location.A;
        				poc.clng 				= results[0].geometry.location.F;
	         	});
	    					    	
		    	} else {
		    		$scope.$apply(function () {
		    			poc.showError = true;
	         		});
		    		// console.log(status);
		    	    
		    	 
		    	}
			});
			// call google api end
		
		};

	// //get all tasks' addresses from backend
	// 	poc.getAddresses = 	function() {
	// 		// var deferred = $q.defer();
			
	// 		postService.get('get_addresses')
	// 		.then(function(response) {
	// 			poc.addresses = response.data.addresses;
	// 			// show  submit form
	// 			poc.showOrderSubmit = true;
	// 			// deferred.resolve(poc.addresses);
	// 		},function(error) {
	// 			console.log(error);
	// 			// deferred.reject(error);
	// 		})

	// 		// return deferred.promise;
	// 	};
	// // get tasks' addresses end


	//get all tasks' addresses from backend
		poc.getAddresses = 	function() {

			
			postService.get('get_addresses')
			.then(function(response) {
				poc.addresses = response.data.addresses;
				// show  submit form
				poc.showOrderSubmit = true;
			})
			.then(function() {
				poc.areaCheck()
			})
			.catch(function(error) {
				console.log(error)
				alert('error')
			})

		};
	// get tasks' addresses end








		poc.areaCheck = function() {
			//start creat a addresses array
			poc.addresses_array = [];
			
			poc.task_address = [poc.clat + ',' + poc.clng , "43.825466,-79.288094"]
	

			poc.addresses.push(poc.clat + ',' + poc.clng )
			poc.addresses.push( "43.825466,-79.288094")
			//split address
			poc.g_addresses = _.chunk(poc.addresses, 25);


			_.forEach(poc.g_addresses, function(destinations, key) {
				 
				  // console.log(address, key);
				  
				  //set timeout
				  	if (key > 1 ) {
				  		key = key * 5000;
				  	} else{
				  		key = key;
				  	};
				console.log(destinations);
				
				$timeout(function() {
					var request = {
					  origins: poc.task_address ,
					  destinations: destinations,
					  travelMode: google.maps.TravelMode.DRIVING,
					  unitSystem: google.maps.UnitSystem.METRIC,
					  avoidHighways: false,
					  avoidTolls: false
					};

					distance.getDistanceMatrix(request, function (response, status) {
					    if (status === google.maps.DistanceMatrixStatus.OK) {

					      	var origin_addresses = response.originAddresses;
					    	var destination_addresses = response.destinationAddresses;
					    	var rows = response.rows;
					    	console.log(response);
					    	_.forEach(poc.task_address, function(origin, key) {

					    		var row = key
					    		_.forEach(destinations, function(destination, key){
					    			if(origin !== destination){

					    				var duration = rows[row].elements[key].duration.value*1000;
					    				var distance = rows[row].elements[key].distance.value;
					    				
					    				poc.addresses_array.push({
					    					start 	: origin,
					    					end		: destination,
					    					duration: duration,
					    					distance: distance,
					    					start_end : origin + destination

					    				})
					    			}
					    			

					    		})
					    	})
					    } else {
					      	
					      	console.log(response)
					       	
					      // alert('Google route unsuccesfull!');
					    }
					});

				 }, key);
				
				$timeout(function() {
					var request = {
					  origins:  destinations,
					  destinations: poc.task_address,
					  travelMode: google.maps.TravelMode.DRIVING,
					  unitSystem: google.maps.UnitSystem.METRIC,
					  avoidHighways: false,
					  avoidTolls: false
					};

					distance.getDistanceMatrix(request, function (response, status) {
					    if (status === google.maps.DistanceMatrixStatus.OK) {

					      	var origin_addresses = response.originAddresses;
					    	var destination_addresses = response.destinationAddresses;
					    	var rows = response.rows;
					    	console.log(response);
					    	_.forEach(destinations, function(origin, key) {

					    		var row = key
					    		_.forEach(poc.task_address, function(destination, key){
					    			if(origin !== destination){

					    				var duration = rows[row].elements[key].duration.value*1000;
					    				var distance = rows[row].elements[key].distance.value;
					    				
					    				poc.addresses_array.push({
					    					start 	: origin,
					    					end		: destination,
					    					duration: duration,
					    					distance: distance,
					    					start_end : origin + destination

					    				})
					    			}
					    			

					    		})
					    	})
					    } else {
					      	
					      	console.log(response)
					       	
					      // alert('Google route unsuccesfull!');
					    }
					});

				 }, 2000);

				
			});
			
		};	
		poc.preorderSubmit = function(preorderData) {
			
			preorderData =	{
				lat	: '43.825466', 
				lng	: '-79.288094',
				clat: poc.clat,
				clng: poc.clng
			}


			//add address array 

			preorderData.path =  _.uniq(poc.addresses_array,'start_end');
			
			if (window.cordova) {
				$cordovaProgress.showBarWithLabel(true, 30000, "Order Submitting");			     	
						     	
		    }

			poc.url = 'preorder/'

			postService.post(preorderData, poc.url).then(function(response) {
				console.log(response);
				poc.response = response.data

				 if (poc.response == 'OK'){
				 	 	poc.orderData.delCharge = poc.response.charge;

				 	var confirmPopup = $ionicPopup.confirm({
				 	    title	: poc.response.msg,
				 	    template: 'Time:' + poc.response.wait + ' Total:' + poc.response.charge
				 	  });
				 	  confirmPopup.then(function(res) {
				 	    if(res) {
				 	    	poc.orderSubmit();
				 	    } else {

				 	    }
				 	  });
				 	


					if (window.cordova) {
				     	
			     	 	$timeout(function() {
			     		       
			     		    	$cordovaDialogs.alert('下单成功,感谢您使用馋猫订餐', '单号:' + poc.response.oid , '确认')
       					     	.then(function() {
       					     	   $location.path( "/tab/home" );
       					     	});

			     		    }, 3000);
				     	
				    }

				 } else{
				 	poc.error_msg = poc.response.error_msg
				 	


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
			},function(error) {
				console.log(error);
			})

		}

		poc.orderSubmit = function(submitData) {
			submitData = { 	addr 	: poc.cformatted_address,
							city 	: poc.areaCheckData.city,
							unit 	: poc.orderData.apt,
							postal 	: poc.areaCheckData.postalCode,	
							tel 	: poc.orderData.tel,
							name 	: poc.orderData.name,
							price 	: poc.orderData.price,
							paytype : poc.orderData.paytype,
							// charge 	: poc.orderData.delCharge,
							charge 	: 10.00,
							clat 	: poc.clat,
							clng 	: poc.clng,
							lat		: '43.825466', 
							lng		: '-79.288094',
							ready	: 1800,
							tips	: poc.orderData.tips
			}

			poc.url = 'order/'
			postService.post(submitData, poc.url).then(function(response) {


 	    		if (response.data.result == 0) {
 	    			
 	    			// init addresses array
 	    			poc.addresses_array = [];
    				
    				//order submit succeed; init order submit 
    				poc.backToAreaCheck()

    				poc.cleanAreaCheckData()	

    				$location.path( "/tab/summary" );
   
 	    		} else{
 	    			console.log(response);
 	    		};
			},function(error) {
				console.log(error)
			})
		};

		poc.cleanAreaCheckData = function() {

			poc.areaCheckData = {}

			poc.orderData = {}

			poc.submitData = {}

		};

		poc.backToAreaCheck = function() {
			
			poc.showOrderSubmit = false

			poc.orderData = {}

			poc.submitData = {}

			if (window.cordova && window.cordova.plugins.Keyboard) {
			    cordova.plugins.Keyboard.disableScroll(false);
			}

		};

  });
