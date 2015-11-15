'use strict';

/**
 * @ngdoc service
 * @name smartDriverApp.taskService
 * @description
 * # taskService
 * Factory in the smartDriverApp.
 */
angular.module('SmartDriver')
    .factory('taskService', ['$rootScope','$q','$firebaseObject',function ($rootScope,$q,$firebaseObject) {
        var ts              = {};
        var firebase_url    = new Firebase('https://miss-client.firebaseio.com/driver/2')
        var obj             = $firebaseObject(firebase_url);

        ts.get_all_tasks = function(scope) {
//test data 
            var data = {"order":[
                        {"aid":1,
                         "addr":"365 prince of wales",
                         "oid":"1000007",
                         "pretax":"35.79",
                         "total":"40.5",
                         "uid":3
                        },
                        {"aid":2,
                         "addr":"3888 Duke of York Blvd",
                         "oid":"1000008",
                         "pretax":"35.79",
                         "total":"40.5",
                         "uid":3
                        },
                        {"aid":1,
                         "addr":"365 prince of wales",
                         "oid":"1000009",
                         "pretax":"35.79",
                         "total":"40.5",
                         "uid":3
                        },
                        {"aid":3,
                         "addr":"4056 Confederation Parkway",
                         "oid":"1000010",
                         "pretax":"35.79",
                         "total":"40.5",
                         "uid":3
                        },
                        {"aid":1,
                         "addr":"365 prince of wales",
                         "oid":"1000011",
                         "pretax":"135.79",
                         "total":"140.5",
                         "uid":4
                        },
                        {"aid":5,
                         "addr":"388 prince of wales",
                         "oid":"1000013",
                         "pretax":"35.79",
                         "total":"40.5",
                         "uid":4
                        },
                        {"aid":4,
                         "addr":"385 prince of wales",
                         "oid":"1000012",
                         "pretax":"35.79",
                         "total":"40.5",
                         "uid":4
                        }],"uid":1}
//test data end                      
           
                obj.$loaded()
                    .then(function(data) {
                      
                    var la_tasks = []
                        _.forEach(data.order,function(task,key) {
                            var already_has_aid = _.findIndex(la_tasks, function(tasks) {
                                    return tasks.aid == task.aid;
                                });

                            if (already_has_aid !== -1) {
                                  la_tasks[already_has_aid].subtasks.push(task)   
                            } else{
                                var lo_task = {}
                                lo_task.aid         = task.aid;
                                lo_task.addr        = task.addr;
                                lo_task.subtasks    = [];
                                lo_task.subtasks.push(task)
                                la_tasks.push(lo_task)
                            };
                        })
                      console.log(la_tasks)
                      scope.la_tasks = la_tasks;
                      localStorage.setItem("la_tasks", JSON.stringify(la_tasks));
                    })
                    .catch(function(error) {
                      console.error("Error:", error);
                    });
            
                
               
        };
        ts.watch_tasks  = function(scope) {
            document.addEventListener("deviceready", function () {
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                                                  alert('online')
                                                  var onlineState = networkState;
                                                  })
                                   
               // listen for Offline event
               $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                              alert('offline')
                              var offlineState = networkState;
                              scope.la_tasks = localStorage.getItem("la_tasks");
                })
            },false)
            

             obj.$watch(function() {
                ts.get_all_tasks(scope)
             });
        };

        ts.off_line = function(scope) {

        };

        ts.finsh_task   = function() {

        };

        ts.set_cur_route = function() {

        };

        ts.rm_cur_route = function() {

        };

        return ts;

    }]);
