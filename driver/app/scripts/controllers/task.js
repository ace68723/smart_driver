'use strict';

/**
 * @ngdoc function
 * @name smartDriverApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the smartDriverApp
 */
angular.module('SmartDriver')
  .controller('TaskCtrl', function ($scope,$firebaseArray,$firebaseObject,$timeout,$http,$cordovaGeolocation,$cordovaDialogs) {
    var tc = this;
    var ref         = new Firebase("https://ajaxsmart.firebaseio.com/drivers/23/tids");
    var order_ref   = new Firebase("https://ajaxsmart.firebaseio.com/rrclient/all_orders");
    tc.tasks    = $firebaseArray(ref);

    
    $timeout(function() {
    // 	_.forEach($scope.tasks,function(task,id) {
    // 		console.log(task.$value)
    // 		var t_str = task.$value.split(',');
    // 		console.log(t_str)
    // 		if (t_str[0]) {} else{};
    // 	})
    get_order_id();
    },1500)
    function get_order_id (argument) {
    	tc.cur_tid = tc.tasks[0].$value;
		var cur_tid_data = {'tid':tc.cur_tid}
		$http.post('http://localhost:3000/tid_to_oid', cur_tid_data).
		  success(function(data, status, headers, config) {
		    console.log(data)
            tc.task_type = data.task_type;
             get_order_info(data.oid) 
		  }).
		  error(function(data, status, headers, config) {
		    console.log(data)
		  });

    }
		
    function get_order_info (oid) {
        tc.order_info =  $firebaseObject(order_ref.child(oid))
         console.log(tc.order_info)

    }

    tc.driver_action = function () {

        var tid_data     = {};
        tid_data.tid     = tc.cur_tid;
        tid_data.action  = 1;
        $cordovaDialogs.confirm('message', 'title', ['button 1','button 2'])
            .then(function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = buttonIndex;
                console.log('btnIndex',btnIndex)
                if (btnIndex == 1) {
                    $http.post('http://localhost:3000/driver_action', tid_data).
                      success(function(data, status, headers, config) {
                        console.log(data)
                        get_order_id()
                      }).
                      error(function(data, status, headers, config) {
                        console.log(data)
                      });
                } else{
                    return
                };
            });
        
    }
    tc.direction = function() {
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
         $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                 var lat  = position.coords.latitude
                 var long = position.coords.longitude
                 tc.destination = tc.cur_tid.split(',')[2] + ',' + tc.cur_tid.split(',')[3];
                 console.log(tc.destination)
                 plugin.google.maps.external.launchNavigation({
                   "from": lat + ', ' + long ,
                   "to": tc.destination
                 });
            }, function(err) {
             // error
            });
       
    };
    
  });
