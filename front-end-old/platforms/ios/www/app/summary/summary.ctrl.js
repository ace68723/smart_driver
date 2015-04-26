var OrderSummaryCtrl = angular.module('OrderSummaryCtrl',[]);

OrderSummaryCtrl.controller('orderSummaryCtrl',['$timeout','$cordovaActionSheet', function  ($timeout,$cordovaActionSheet ) {
	// od OrderDetial
	var osc = this;

	osc.actions = [{ oid : 213,
					price: 56,
					reason: "Customer did't answer"
					},
					{ oid : 237,
					price: 42,
					reason: "Restaurant Delay"
					}
	]

	osc.orders = [{ oid : 213,
					price: 56,
					status: "Done"
					},
					{ oid : 237,
					price: 42,
					status: "Delivering"
					}
	]

	osc.doAction = function(id) {

		osc.doAction.oid = osc.actions[id].oid 

		console.log(osc.doAction.oid)
		

	  		if (window.cordova && window.cordova.plugins.Keyboard) {

	  			var options = {
	  			    title: 'What do you want do with the order No.' + osc.doAction.oid + '?',
	  			    buttonLabels: ['Re-delivery this order', 'Close this order'],
	  			    addCancelButtonWithLabel: 'Cancel',
	  			    androidEnableCancelButton : true,
	  			    winphoneEnableCancelButton : true,
	  			    // addDestructiveButtonWithLabel : 'Delete it'
	  			 };

	  			$cordovaActionSheet.show(options)
	  			  .then(function(btnIndex) {
	  			    var index = btnIndex;
	  			    console.log(btnIndex)
	  			});

	  	    }

		    
	};

}])