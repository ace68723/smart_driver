'use strict';

/**
 * @ngdoc function
 * @name smartDriverApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the smartDriverApp
 */
angular.module('SmartDriver')
  .controller('TaskCtrl', function ($scope,$firebaseArray,$timeout,$http) {
    var ref = new Firebase("https://ajaxsmart.firebaseio.com/drivers/23/tids");
    $scope.tasks = $firebaseArray(ref);

    
    $timeout(function() {
    // 	_.forEach($scope.tasks,function(task,id) {
    // 		console.log(task.$value)
    // 		var t_str = task.$value.split(',');
    // 		console.log(t_str)
    // 		if (t_str[0]) {} else{};
    // 	})

    },500)

    function get_order_info (argument) {
    	var cur_tid = $scope.tasks[0].$value;
		var cur_tid_data = {'tid':cur_tid}
		$http.post('http://localhost:3000/tid_to_oid', cur_tid_data).
		  success(function(data, status, headers, config) {
		    console.log(data)
		  }).
		  error(function(data, status, headers, config) {
		    console.log(data)
		  });

    }
		
    
  });
