var PlaceOrderCtrl = angular.module('PlaceOrderCtrl',['google-maps']);

PlaceOrderCtrl.controller('placeOrderCtrl',['placeOrderService', '$timeout',function  (placeOrderService, $timeout) {

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

	poc.orderData.pretax = "35.99";

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

	poc.areaCheck = function() {
		poc.data = [poc.areaCheckData.formattedAddress, "13850 Steeles Avenue West Halton Hills, ON L7G 0J1, Canada"]
		
		console.log(poc.data)

		_.forEach(poc.address4, function(address, key) {
			 
			  console.log(address, key);
			  	
			  	if (key > 1 ) {
			  		key = key * 5000;
			  	} else{
			  		key = key;
			  	};
				
			$timeout(function() {
				pos.getDistance(poc.data, address).then(function(data) {

					console.log(data)

					console.log(data.destinationAddresses)

					poc.response = data.response

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
	poc.areaCheck2 = function() {
		pos.areaCheck(poc.areaCheckData.lat, poc.areaCheckData.lng).then(function(data) {

			console.log(data)

			poc.response = data.response

			poc.orderData.dlexp = poc.response.dlexp;

			poc.showOrderSubmit = true

			poc.orderData.formattedAddress = poc.areaCheckData.formattedAddress

			if (window.cordova && window.cordova.plugins.Keyboard) {
		      cordova.plugins.Keyboard.disableScroll(true);
		    }

		}, function(error) {
		 	
		 	console.log(error)
		 	poc.showError = true
		 
		})

	};

	poc.orderSubmit = function() {

		poc.submitData = { 	"rid" : window.localStorage.getItem("sv_rid"),
							"token" : window.localStorage.getItem("sv_token"),
							"channel" : 3,
							"uid" : window.localStorage.getItem("sv_uid"),
							"dltype" : 1,
							"dlexp" : poc.orderData.dlexp,
							"pretax" : poc.orderData.pretax,
							"comment" : " ",
							"postal" : poc.areaCheckData.postalCode,
							"name" : poc.orderData.name,
							"city" : poc.areaCheckData.city,
							"addr" : poc.orderData.formattedAddress,
							"tel" : poc.orderData.tel,
							"apt_no" : poc.orderData.apt,
							"buzz" : poc.orderData.buzz,
							"lat" : poc.areaCheckData.lat,
							"lng" : poc.areaCheckData.lng

		}
		// poc.orderData.rid =  window.localStorage.getItem("sv_rid")

		// poc.orderData.token =  window.localStorage.getItem("sv_token")

		// poc.orderData.channel = 3

		// poc.orderData.uid =  window.localStorage.getItem("sv_uid")

		// poc.orderData.dltype = 1

		// poc.orderData.comment = " "

		console.log(poc.submitData)

		pos.orderSubmit(poc.submitData).then(function(data) {

			console.log(data)

			poc.response = data.response

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
	poc.address3 = [ "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "100 City Centre Drive Mississauga, ON L5B 2C9",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "100 City Centre Drive Mississauga, ON L5B 2C9",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "100 City Centre Drive Mississauga, ON L5B 2C9",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5",
                      "460 Horner Ave, Etobicoke, ON M8W 2B5"
                    ];
    poc.address4 = _.chunk(poc.address3, 25);
    console.log(poc.address4)

    poc.test = _.forEach(poc.address4, function(address, key) {
	  
	  // console.log(address, key);

	});

}])