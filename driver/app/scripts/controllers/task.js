'use strict';

/**
 * @ngdoc function
 * @name smartDriverApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the smartDriverApp
 */
angular.module('SmartDriver')
  .controller('TaskCtrl', 
    function ($scope,$firebaseArray,$firebaseObject,$timeout,$http,$cordovaGeolocation,$cordovaDialogs,$cordovaSms,API_URL,$rootScope,driver) {
    var tc          = this;

    var ref;
    var order_ref   = new Firebase("https://ajaxsmart.firebaseio.com/rrclient/all_orders");
    $rootScope.get_uid = function() {
        var uid         = localStorage.getItem("uid");
        console.log('uid',uid)
        // var ref         = new Firebase("https://ajaxsmart.firebaseio.com/drivers/"+ uid +"/tids");
        var ref         = new Firebase("https://ajaxsmart.firebaseio.com/drivers/"+ uid +"/tids");
        console.log("https://ajaxsmart.firebaseio.com/drivers/"+ uid +"/tids");
        
        tc.tasks        = $firebaseArray(ref);

        ref.on('value', function(dataSnapshot) {
                console.log(dataSnapshot.hasChildren())
                if (dataSnapshot.hasChildren()) {
                     tc.has_tasks = true;
                     $timeout(function() {
                        // $cordovaProgress.hide();
                        $cordovaDialogs.alert('^_^', 'New Task', 'ok')
                            .then(function() {

                               get_order_id();
                            });
                        
                      }, 5000);
                }else{
                    // $cordovaProgress.hide();
                        $cordovaDialogs.alert('^_^', 'Finsih All Tasks', 'ok')
                            .then(function() {

                            });
                    tc.has_tasks = false;
                }
            });
    };



    $rootScope.do_checkin = function() {
        $cordovaDialogs.confirm('Please Check In ', 'Action', ['Confirm','Cancel'])
            .then(function(buttonIndex) {
                
                // $cordovaProgress.showSimple(true)

                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = buttonIndex;
                console.log('btnIndex',btnIndex)
                if (btnIndex == 1) {
                    driver.checkin()
                    .then(function(io_result) {
                        var result = io_result.result
                        if (result == 0) {
                            $rootScope.driver_checkin = true;     
                        } else{
                            $cordovaDialogs.alert('Error', 'Check in fail', 'ok')
                            .then(function() {
                               
                            });
                        };
                    })
                    .catch(function() {
                        $cordovaDialogs.alert('Error', 'Please check your internet connection', 'ok')
                        .then(function() {
                           
                        });
                    })
                   
                } else{
                    return
                };
            });
    }
    $rootScope.do_checkout = function() {
        $cordovaDialogs.confirm('Check Out ', 'Action', ['Confirm','Cancel'])
            .then(function(buttonIndex) {
                
                // $cordovaProgress.showSimple(true)

                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = buttonIndex;
                console.log('btnIndex',btnIndex)
                if (btnIndex == 1) {
                    driver.checkout()
                    .then(function(io_result) {
                        var result = io_result.result
                        if (result == 0) {
                            $rootScope.driver_checkin = false;     
                        } else{
                            $cordovaDialogs.alert('Error', 'Check out fail', 'ok')
                            .then(function() {
                               
                            });
                        };
                    })
                    .catch(function() {
                        $cordovaDialogs.alert('Error', 'Please check your internet connection', 'ok')
                        .then(function() {
                           
                        });
                    })
                   
                } else{
                    return
                };
            });
    }

    $rootScope.do_ischeckin = function() {
        driver.ischeckin()
        .then(function(io_result) {
            var result = io_result.result;
            if (result == 0) {
                $rootScope.driver_checkin = true;          
            } else{
                $rootScope.driver_checkin = false;
                $rootScope.do_checkin(); 
            };
        })
        .catch(function() {
            $cordovaDialogs.alert('Error', 'Please check your internet connection', 'ok')
            .then(function() {
               
            });
        })
    }
    $rootScope.do_ischeckin()

   
    
    // $timeout(function() {
    // 	_.forEach($scope.tasks,function(task,id) {
    // 		console.log(task.$value)
    // 		var t_str = task.$value.split(',');
    // 		console.log(t_str)
    // 		if (t_str[0]) {} else{};
    // 	})
    //     ref.on('value', function(dataSnapshot) {
    //        console.log(dataSnapshot)
    //     });
    // },2500)

    function get_order_id (argument) {
      console.log(tc.tasks)
        if(tc.tasks[0]){
            tc.cur_tid = tc.tasks[0].$value;
            var cur_tid_data = {'tid':tc.cur_tid}
            $http.post(API_URL + 'tid_to_oid', cur_tid_data).
              success(function(data, status, headers, config) {
                console.log(data)
                tc.task_type = data.task_type;
                $timeout(function() {
                    get_order_info(data.oid) 
                }, 500);
                 
              }).
              error(function(data, status, headers, config) {
                console.log(data)
              });
        }else{
           $cordovaDialogs.alert('Error', 'Please check your internet connection', 'ok')
               .then(function() {
                  $timeout(function() {
                        get_order_id();
                      }, 5000);
               });

        } 
    }
	function task_alart () {
        if(!tc.has_tasks){

        }
    }	
    function get_order_info (oid) {
        console.log(oid)
        tc.order_info =  $firebaseObject(order_ref.child(oid))
         console.log(tc.order_info)

    }
    tc.send_message = function() {
        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
        };

        $cordovaSms
          .send(tc.order_info.tel, 'Hi,this is food delivery guy, I\'m 3 minutes away please pay attention :)', options)
          .then(function() {
            // Success! SMS was sent
          }, function(error) {
            // An error occurred
          });
    };
    tc.driver_action = function () {
        
       

        var tid_data     = {};
        tid_data.tid     = tc.cur_tid;
        tid_data.action  = 1;
        $cordovaDialogs.confirm('Task Finish', 'Action', ['Confirm','Cancel'])
            .then(function(buttonIndex) {
                
                // $cordovaProgress.showSimple(true)

                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = buttonIndex;
                console.log('btnIndex',btnIndex)
                if (btnIndex == 1) {
                    $http.post(API_URL+'driver_action', tid_data).
                      success(function(data, status, headers, config) {
                        console.log(data)
                       
                        // get_order_id()
                      }).
                      error(function(data, status, headers, config) {
                       // $cordovaProgress.hide();

                        $cordovaDialogs.alert('Error', 'Please check your internet connection', 'ok')
                            .then(function() {
                               
                            });
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
