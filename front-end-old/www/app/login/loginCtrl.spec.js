'use strict';

describe('loginCtrl',function  () {
        var loginCtrl, loginService,postService, $httpBackend, $controller;
        var user = {'userName': 'test',
                    'password': 'test123'};

        beforeEach(module("LoginCtrl"));
        beforeEach(module("LoginService"));
        beforeEach(module("PostServiceTest"));
       
        //remove local token
        beforeEach(inject(function() {
            window.localStorage.removeItem('sv_token')
        }))

        beforeEach(inject(function  ( _loginService_, _postService_, _$httpBackend_,$controller) {
             
            loginService = _loginService_;

            postService = _postService_;

            loginCtrl = $controller("loginCtrl",{loginService:loginService})

            $httpBackend = _$httpBackend_;

          
        }));
    
    it('should call login service submit meathod', function() {


              var respond = {
                     'result': 0,
                     'rid': 3,
                     'uid': 2,
                     'token': 'sdfkdkqikdkkqe',
                     'error_msg': 'pasword'}
              $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/', user).respond(200, respond);
              
              //call submit function
              loginCtrl.submit(user)

              // $http are never called until $httpBackend.flush() is called in unit tests
              $httpBackend.flush();

              // get result 0; username and password are correct, login successful.
              expect(loginService.response.result).toBe(respond.result);

    })
    
    it('should be network ERROR', function() {
      
              

                var url ='login/';   

                var respond = {
                     'result': 0,
                     'rid': 3,
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

describe('loginCtrl with token',function  () {
        var loginCtrl, loginService,postService, $httpBackend, $controller;
        var user = {'userName': 'test',
                    'password': 'test123'};

        beforeEach(module("LoginCtrl"));
        beforeEach(module("LoginService"));
        beforeEach(module("PostServiceTest"));
       
        
        beforeEach(inject(function  ( _loginService_, _postService_, _$httpBackend_,$controller) {
             
            loginService = _loginService_;

            postService = _postService_;

            loginCtrl = $controller("loginCtrl",{loginService:loginService})

            $httpBackend = _$httpBackend_;

            
        }));

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

            if(window.localStorage.getItem("sv_token") != null){
                 loginService.checkToken()
            } 

            // $http are never called until $httpBackend.flush() is called in unit tests
            $httpBackend.flush();
            
            //login success
            expect(loginService.response.result).toBe(0);
          
              

    })
    



})