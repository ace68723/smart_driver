var PlaceOrderCtrl = angular.module('PlaceOrderCtrl',['google-maps']);

PlaceOrderCtrl.controller('placeOrderCtrl',['placeOrderService', '$timeout', '$scope',
	function  (placeOrderService, $timeout,$scope) {

	// lc loginCtrl
	var poc = this;
	var pos = placeOrderService;
	
	if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.disableScroll(false);
    }

	poc.areaCheckData = {}

	poc.orderData = {}


	//not show order submit, check area first
	poc.showOrderSubmit = null

	//for address test
	poc.areaCheckData.address = '2620 Kennedy Rd';

	poc.areaCheckData.city = 'Scarborough';

	poc.areaCheckData.postalCode = 'M1T 3H1';

	poc.orderData.name = "aiden";

	poc.orderData.tel = "5197745881";

	poc.orderData.apt = "515";

	poc.orderData.buzz = "5126";

	poc.orderData.price = "35.99";

	poc.getCodeAddress = function() {

		//for safari, init input value
		 poc.areaCheckData.formattedAddress = null
		 
		 poc.destination = poc.areaCheckData.address + ', ' + poc.areaCheckData.city + ', ' + poc.areaCheckData.postalCode
		
		
		pos.getCodeAddress( poc.destination).then(function(data) {
		    
		     poc.areaCheckData.formattedAddress = data.formattedAddress;


		     
		     poc.areaCheckData.lat = data.lat;
		     
		     poc.areaCheckData.lng = data.lng;

		     poc.showError = false
		     
		     console.log(data)
		 
		 }, function(error) {
		 	
		 	console.log(error)
		 	poc.showError = true
		    


		});

	};

	poc.getAddress = function() {
		pos.getAddresses().then(
		function(data) {
			poc.addresses = data.addresses
			// console.log(poc.addresses)
			poc.areaCheck() 
		},function(error) {
			console.log(error)
		})
	};


	poc.areaCheck = function() {
		poc.data = [poc.areaCheckData.formattedAddress, "43.825466, -79.288094"]
		

		
		//split address
		poc.g_addresses = _.chunk(poc.addresses, 25);


		_.forEach(poc.g_addresses, function(address, key) {
			 
			  // console.log(address, key);
			  
			  //set timeout
			  	if (key > 1 ) {
			  		key = key * 5000;
			  	} else{
			  		key = key;
			  	};
				
			$timeout(function() {
				pos.getDistance(poc.data, address)

				.then(function(data) {

					// console.log(data)

					// console.log(data.destinationAddresses)
					poc.response = data.response
					// poc.creat_addresses_array()
					if (window.cordova && window.cordova.plugins.Keyboard) {
				      cordova.plugins.Keyboard.disableScroll(true);
				    }


				}, function(error) {
				 	
				 	console.log(error)
				 	poc.showError = true
				 
				})

			 }, key);

			poc.orderData.formattedAddress = poc.areaCheckData.formattedAddress
			
			poc.showOrderSubmit = true
			poc.orderData.distance = 5
			poc.orderData.delCharge = 5
		});
	};	
	// poc.areaCheck2 = function() {
	// 	pos.areaCheck(poc.areaCheckData.lat, poc.areaCheckData.lng).then(function(data) {

	// 		console.log(data)

	// 		poc.response = data.response

	// 		poc.orderData.dlexp = poc.response.dlexp;

	// 		poc.showOrderSubmit = true

	// 		poc.orderData.formattedAddress = poc.areaCheckData.formattedAddress

	// 		if (window.cordova && window.cordova.plugins.Keyboard) {
	// 	      cordova.plugins.Keyboard.disableScroll(true);
	// 	    }

	// 	}, function(error) {
		 	
	// 	 	console.log(error)
	// 	 	poc.showError = true
		 
	// 	})

	// };


	poc.preorderSubmit = function() {


		poc.preorderData =	{
			lat	: 43.825466, 
			lng	: -79.288094,
			clat: poc.areaCheckData.lat,
			clng: poc.areaCheckData.lng
		}
		poc.submitData = { 	addr 	: poc.orderData.formattedAddress,
							city 	: poc.areaCheckData.city,
							unit 	: poc.orderData.apt,
							postal 	: poc.areaCheckData.postalCode,	
							tel 	: poc.orderData.tel,
							name 	: poc.orderData.name,
							price 	: poc.orderData.price,
							paytype : '1',
							charge 	: poc.orderData.delCharge,
							clat : poc.areaCheckData.lat,
							clng : poc.areaCheckData.lng

		}

		pos.preorderSubmit(poc.preorderData,poc.submitData).then(

		function(data) {

			console.log(data)

			poc.response = data.response;


			//order submit succeed; init order submit 
			poc.backToAreaCheck()

			poc.cleanAreaCheckData()


		}, function(error) {
		 	
		 	console.log(error)
		 	poc.showError = true
		 
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

	// address test
	// poc.address3 = [ "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "100 City Centre Drive Mississauga, ON L5B 2C9",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "100 City Centre Drive Mississauga, ON L5B 2C9",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "100 City Centre Drive Mississauga, ON L5B 2C9",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
 //                      "460 Horner Ave, Etobicoke, ON M8W 2B5"
 //                    ];
 //    poc.address4 = _.chunk(poc.address3, 25);
  	//split array


}])