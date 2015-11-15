'use strict';

/**
 * @ngdoc service
 * @name smartDriverApp.authToken
 * @description
 * # authToken
 * Factory in the smartDriverApp.
 */
angular.module('SmartDriver')
  .factory('auth', ['$window','$injector','API_URL',function ($window, $injector,API_URL) {
    var storage = $window.localStorage;
    var auth = {};
    var cachedToken;
    var res_code;

   
        auth.setToken =function(token) {
            cachedToken = token;
            storage.setItem('userToken', token);
        };
        auth.getToken =function() {
            if(!cachedToken)
                cachedToken = storage.getItem('userToken');
            return cachedToken;
        };
        auth.isAuthenticated =function() {
            return !!this.getToken();
        };
        auth.isWechatInstalled =function() {
            console.log('here')
            Wechat.isInstalled(function (installed) {
                alert("Wechat installed: " + (installed ? "Yes" : "No"));
                return installed;
            });
           
        };
        auth.doWechatAuth =function() {
            Wechat.auth("snsapi_userinfo", function (response) {
                alert(JSON.stringify(response));;
                res_code = response.code;
                auth.send_res_code()

            }, function (reason) {
                alert("Failed: " + reason);
            });
        };
        auth.get_res_code =function() {
            return res_code;
        };
        auth.send_res_code =function() {
            var $http =  $injector.get('$http')
            $http.get(API_URL + 'get_driver_info').
                success(function(data, status, headers,conifg) {
                    console.log(data)
                    auth.setToken(data.user_token)
                })
                .error(function(data, status, headers,conifg) {
                    console.log('error send res code')
                });

        }

     return auth
  }]);
