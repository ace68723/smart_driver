'use strict';

describe('loginService',function  () {
     var loginService, postService, $httpBackend, $location, $timeout;
     var user = {'userName': 'test',
                    'password': 'test123'};
     beforeEach(module("LoginService"));
     beforeEach(module("PostServiceTest"));
     beforeEach(inject(function  ( _loginService_, _postService_, _$httpBackend_, _$location_, _$timeout_) {
         
          loginService = _loginService_;
          
          postService = _postService_;

          $httpBackend = _$httpBackend_;

          $location = _$location_;

          $timeout = _$timeout_;

     }));

    it('should login success', function() {

              

              var url ='login/';   

              var respond = {
                     'result': 0,
                     'rid': 1,
                     'uid': 2,
                     'token': 'sdfkdkqikdkkqe',
                     'error_msg': 'pasword'}
            
              $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/', user).respond(200, respond);
              
              //call submit function
              loginService.submit(user)

              // $http are never called until $httpBackend.flush() is called in unit tests
              $httpBackend.flush();

              //get result 0; username and password are correct, login successful.
              expect(loginService.response.result).toBe(0);

              // $timeouts are never called until $timeout.flush() is called in unit tests
              // call time out and change the url
              $timeout.flush();

              //change url to home page
              expect($location.path()).toBe('/tab/home')

    })

    it('should save data in local', function  () {
            
              var url ='login/';
              
              var respond = {
                            'result': 0,
                            'rid': 3,
                            'uid': 2,
                            'token': 'sdfkdkqikdkkqe',
                            'error_msg': 'pasword'}
            
              $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/', user).respond(200, respond);
            
              //call submit function
              loginService.submit(user)

              // $http are never called until $httpBackend.flush() is called in unit tests
              $httpBackend.flush();
              
              //get result 0; username and password are correct, login successful.
              expect(loginService.response.result).toBe(0);

              //save userID, restaurantID and token to local storage.
              expect(window.localStorage.getItem("sv_uid")).toBe('2');

              expect(window.localStorage.getItem("sv_rid")).toBe('3');

              expect(window.localStorage.getItem("sv_token")).toBe('sdfkdkqikdkkqe');
    
    })

    it('should login fail and show error', function() {
              
              var url ='login/';
              
              var respond = {
                        'result': 1,
                        'rid': 1,
                        'uid': 2,
                        'token': 'sdfkdkqikdkkqe',
                        'error_msg': 'pasword'}
            
              $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/', user).respond(200, respond);

              //call submit function
              loginService.submit(user)
              
              // $http are never called until $httpBackend.flush() is called in unit tests
              $httpBackend.flush();
              
              //get result 1; username and password are not correct, login fail.
              expect(loginService.response.result).toBe(1);

              //get error message
              expect(loginService.response.error_msg).toBe('pasword');

    })

    it('shold logout and remove the local data', function  () {
              var url ='login/';

              var respond = {
                                'result': 0,
                                'rid': 3,
                                'uid': 2,
                                'token': 'sdfkdkqikdkkqe',
                                'error_msg': 'pasword'}
            
              $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/', user).respond(200, respond);
              
              //call submit function
              loginService.submit(user)

              // $http are never called until $httpBackend.flush() is called in unit tests
              $httpBackend.flush();
              
              //get result 0; username and password are correct, login successful.
              expect(loginService.response.result).toBe(0);

               //save userID, restaurantID and token to local storage.
              expect(window.localStorage.getItem("sv_uid")).toBe('2');
              
              expect(window.localStorage.getItem("sv_rid")).toBe('3');
              
              expect(window.localStorage.getItem("sv_token")).toBe('sdfkdkqikdkkqe');
              
              //call logout funcation
              loginService.logout();

              //remove userID, restaurantID and token from local storage.
              expect(window.localStorage.getItem("sv_uid")).toBe(null);
              
              expect(window.localStorage.getItem("sv_rid")).toBe(null);
              
              expect(window.localStorage.getItem("sv_token")).toBe(null);

    })

    it('should send local data to server for chek authority and get a login successful result', function  () {
              
              var url ='authorize/';

              var respond = {
                                'result': 0,
                                'rid': 3,
                                'uid': 2,
                                'token': 'sdfkdkqikdkkqe',
                                'error_msg': 'pasword'}

              //set userID, restaurantID and token to local storage.
              window.localStorage.setItem("sv_uid",  respond.uid);

              window.localStorage.setItem('sv_rid',  respond.rid);
              
              window.localStorage.setItem('sv_token', respond.token);

              //set post data              
              var authData = {'token': window.localStorage.getItem("sv_token"),
                              'rid': window.localStorage.getItem("sv_rid")
                              }   
              //chcek local storage has userID, restaurantID and token.
              expect(window.localStorage.getItem("sv_uid") !== null).toBe(true);

              expect(window.localStorage.getItem("sv_uid") !== null).toBe(true);

              expect(window.localStorage.getItem("sv_uid") !== null).toBe(true);

              $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/authorize/', authData).respond(200, respond);

              //call check token function 
              loginService.checkToken();

              // $http are never called until $httpBackend.flush() is called in unit tests
              $httpBackend.flush();
              
              //login success
              expect(loginService.response.result).toBe(0);

    })

    it('should send local data to server for chek authority and get a login fail result', function  () {
              
              var url ='authorize/';

              var respond = {
                                'result': 1,
                                'rid': 3,
                                'uid': 2,
                                'token': 'sdfkdkqikdkkqe',
                                'error_msg': 'pasword'}

              //set userID, restaurantID and token to local storage.
              window.localStorage.setItem("sv_uid",  respond.uid);

              window.localStorage.setItem('sv_rid',  respond.rid);
              
              window.localStorage.setItem('sv_token', respond.token);

              //set post data              
              var authData = {'token': window.localStorage.getItem("sv_token"),
                              'rid': window.localStorage.getItem("sv_rid")
                              }   
              //chcek local storage has userID, restaurantID and token.
              expect(window.localStorage.getItem("sv_uid") !== null).toBe(true);

              expect(window.localStorage.getItem("sv_uid") !== null).toBe(true);

              expect(window.localStorage.getItem("sv_uid") !== null).toBe(true);

              $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/authorize/', authData).respond(200, respond);

              //call check token function 
              loginService.checkToken();

              // $http are never called until $httpBackend.flush() is called in unit tests
              $httpBackend.flush();
              
              //login fail
              expect(loginService.response.result).toBe(1);

    })
    
    it('should be network ERROR', function() {

              

                var url ='login/';   

                var respond = {
                     'result': 0,
                     'rid': 1,
                     'uid': 2,
                     'token': 'sdfkdkqikdkkqe',
                     'error_msg': 'pasword'}
                
                $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/', user).respond(400, respond);
                  
                //call submit function
                loginService.submit(user)

                // $http are never called until $httpBackend.flush() is called in unit tests
                $httpBackend.flush();

               //post fail, can not communicate with server, get http status code:4xx
                expect(postService.response).toBe("Please Check Your Network!");


    });
})