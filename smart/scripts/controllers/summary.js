'use strict';

/**
 * @ngdoc function
 * @name smartApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the smartApp
 */
angular.module('smartApp')
  .controller('SummaryCtrl', function (postService,$cordovaActionSheet) {
    var sc = this;

	sc.getSumamry = function() {
		postService.get('get_summary')
			.then(function(response) {
				console.log(response)
				sc.actions 	= response.data.actions;
				sc.orders 	= response.data.orders;
				sc.showSummary = true;
			},function(error) {
				console.log(error)
			})
	};
	sc.getSumamry();
	sc.doAction = function(id) {
		sc.doActionData = {};
		sc.doActionData.oid  = sc.actions[id].oid;
		sc.do_action_url = 'action/'; 
		
		console.log(sc.doActionData.oid)
		

	  		if (window.cordova && window.cordova.plugins.Keyboard) {

	  			var options = {
	  			    title: 'What do you want do with the order No.' + sc.doActionData.oid + '?',
	  			    buttonLabels: ['Re-delivery this order', 'Close this order'],
	  			    addCancelButtonWithLabel: 'Cancel',
	  			    androidEnableCancelButton : true,
	  			    winphoneEnableCancelButton : true,
	  			    // addDestructiveButtonWithLabel : 'Delete it'
	  			 };

	  			$cordovaActionSheet.show(options)
	  			  .then(function(btnIndex) {
	  			    var index = btnIndex;
	  			    if (index === 1) {
	  			    	sc.doActionData.action = index;
	  			    } else if(index === 2){
	  			    	sc.doActionData.action = index;
	  			    };

	  			   
	  			    


	  			    postService.post(sc.doActionData,sc.do_action_url)
	  			    .then(function(response) {
	  			    	console.log(response)
	  			    },function(error) {
	  			    	console.log(error);
	  			    });


	  			    console.log(btnIndex);
	  			});

	  	    }else{
	  	    	//for pc test
	  	    	sc.doActionData.action = 1;
	  	    	postService.post(sc.doActionData,sc.do_action_url)
	  			    .then(function(response) {
	  			    	console.log(response)
	  			    },function(error) {
	  			    	console.log(error);
	  			    });

	  	    }

		    
	};
  });
