'use strict';

/**
 * @ngdoc function
 * @name smartDriverApp.controller:TaskListCtrl
 * @description
 * # TaskListCtrl
 * Controller of the smartDriverApp
 */
angular.module('SmartDriver')
  	.controller('TaskListCtrl', function ($scope,$cordovaActionSheet,$cordovaSms,$cordovaBarcodeScanner,$firebaseObject,auth,taskService) {
  		var tlc 		= this;
  		var firebase_url = new Firebase('https://miss-client.firebaseio.com/driver/1')

  		// var obj = $firebaseObject(firebase_url);
  		// obj.$loaded()
  		//   .then(function(data) {
  		//     $scope.data = data;
  		//   })
  		//   .catch(function(error) {
  		//     console.error("Error:", error);
  		//   });


  		tlc.action = function(aid,addr) {
			var options = {
			    title: addr,
			    buttonLabels: ['发送微信给用户', '导航去该地址'],
			    addCancelButtonWithLabel: '取消',
			    androidEnableCancelButton : true,
			    winphoneEnableCancelButton : true,
			    // addDestructiveButtonWithLabel : 'Delete it'
			};

		  	$cordovaActionSheet.show(options)
		  	    .then(function(btnIndex) {
		  	    	if(btnIndex == 1){
		  	    		tlc.send_message()
		  	    	}else if(btnIndex == 2){

		  	    	}else{
		  	    		return
		  	    	}
		  	    });
  		};
  		tlc.set_destination = function(addr) {
  				var options = {
  				    title: addr,
  				    buttonLabels: ['设置该地址为目的地'],
  				    addCancelButtonWithLabel: '取消',
  				    androidEnableCancelButton : true,
  				    winphoneEnableCancelButton : true,
  				    // addDestructiveButtonWithLabel : 'Delete it'
  				};

  			  	$cordovaActionSheet.show(options)
  			  	    .then(function(btnIndex) {
  			  	    	if(btnIndex == 1){
  			  	    		tlc.send_message()
  			  	    	}else if(btnIndex == 2){

  			  	    	}else{
  			  	    		return
  			  	    	}
  			  	    });
  		};


  		tlc.send_message = function() {
  			//CONFIGURATION
  			var options = {
  			    replaceLineBreaks: false, // true to replace \n by a new line, false by default
  			    android: {
  			        intent: 'INTENT'  // send SMS with the native android SMS messaging
  			        //intent: '' // send SMS without open any other app
  			    }
  			};

  			$cordovaSms
  			  .send('5197745881,6476256266', 'Hi,this is food delivery guy, I\'m 3 minutes away please pay attention :)', options)
  			  .then(function() {
  			    // Success! SMS was sent
  			  }, function(error) {
  			    // An error occurred
  			  });
  		};

  		tlc.send_wechat = function() {
  			//send notification

  		};

  		tlc.isWechatInstalled = function() {
  			auth.isWechatInstalled()
  			// console.log(Wechat.isWechatInstalled())
  			
  		};

  		tlc.doWechatAuth = function() {
  			auth.doWechatAuth()
  		};
  		tlc.scan_qrcode = function() {
  			$cordovaBarcodeScanner
  			     .scan()
  			     .then(function(barcodeData) {
  			       console.log(barcodeData)
  			     }, function(error) {
  			      
  			     });

  		};
  		
  		taskService.watch_tasks(tlc)
  	});
