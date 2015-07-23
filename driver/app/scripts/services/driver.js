'use strict';

/**
 * @ngdoc service
 * @name smartDriverApp.checkin
 * @description
 * # checkin
 * Factory in the smartDriverApp.
 */
angular.module('SmartDriver')
  .factory('driver', function (API_URL,$http,$q,$window) {
    var storage = $window.localStorage;
    var cached_off_time;
    var driver  = this;
    return {
        set_off_time: function(off_time) {
            cached_off_time = off_time;
            storage.setItem('off_time', off_time);
        },
        get_off_time: function() {
            if(!cached_off_time){
                cached_off_time = storage.getItem('off_time');
            }
            return cached_off_time;
        },
        checkin: function() {  
            return $q(function(resolve, reject) {
                $http.post(API_URL + 'driver_checkin', {}).
                    success(function(data, status, headers, config) {
                        resolve(data);
                    }).
                    error(function(data, status, headers, config) {
                        reject('checkin error ' + data);
                }); 
            });
        },
        ischeckin: function() {  
            return $q(function(resolve, reject) {
                $http.post(API_URL + 'driver_ischeckin', {}).
                    success(function(data, status, headers, config) {
                        resolve(data);
                    }).
                    error(function(data, status, headers, config) {
                        reject('checkin error ' + data);
                }); 
            });
        },
        checkout: function() {  
            return $q(function(resolve, reject) {
                $http.post(API_URL + 'driver_checkout', {}).
                    success(function(data, status, headers, config) {
                        resolve(data);
                    }).
                    error(function(data, status, headers, config) {
                        reject('checkin error ' + data);
                }); 
            });
        }
    };
  });
