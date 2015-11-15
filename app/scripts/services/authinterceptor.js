'use strict';

angular.module('SmartDriver')
  .factory('authInterceptor', function (auth) {

    return {
        request:function(config) {
            var token = auth.getToken();
            var res_code = auth.get_res_code()
            if(res_code && !token){
                config.headers.Rescode = res_code;
                config.headers.AuthorToken = 'driver';
            }else if(token)
                config.headers.AuthorToken = token;
            return config   
        },
        response:function(response) {
            return response;
        }
    };
  });
