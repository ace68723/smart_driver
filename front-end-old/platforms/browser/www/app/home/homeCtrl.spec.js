'use strict';

describe('homeCtrl',function  () {
        var homeCtrl, homeService, loginService, postService, $httpBackend, $controller, 
            $location, $timeout;
        var user = {'userName': 'test',
                    'password': 'test123'};

        beforeEach(module("HomeCtrl"));
        beforeEach(module("HomeService"));
        beforeEach(module("PostServiceTest"));
        beforeEach(module("LoginService"));
        beforeEach(module("mock.firebase"));
       
        //remove local token
        beforeEach(inject(function() {
            window.localStorage.removeItem('sv_token')
        }))

        beforeEach(inject(function  ( _homeService_, _loginService_,  _postService_, _$httpBackend_, $controller,  _$location_,  _$timeout_) {
             
            homeService = _homeService_;

            loginService =_loginService_;

            postService = _postService_;

            $location = _$location_;

            $timeout = _$timeout_;

            homeCtrl = $controller("homeCtrl",{loginService:loginService, homeService:homeService})

            $httpBackend = _$httpBackend_;

          
        }));
    
    it('should call home service getOrderDetail meathod', function() {

        var url ='orderdetail/';  

            var oid = 1

            var orderAuth = {} 

            orderAuth.token = window.localStorage.getItem("sv_token"); 
            orderAuth.rid = window.localStorage.getItem("sv_rid"); 
            orderAuth.oid = oid;

            var respond = {
                   comment: "",
                   dltype: 1,
                   error_msg: "",
                   itmes:[],
                   name: "gloria",
                   oid: 7587,
                   result: 0,
                   tel: "6479279299",
                   total: 39.72

                }
            
            $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/orderdetail/', orderAuth).respond(200, respond);
            
            //call submit function
            homeCtrl.getOrderDetail(oid)

            // $http are never called until $httpBackend.flush() is called in unit tests
            $httpBackend.flush();

            //get result 0; username and password are correct, login successful.
            expect(homeService.orderDetail.result).toBe(0);

            // $timeouts are never called until $timeout.flush() is called in unit tests
            // call time out and change the url
            $timeout.flush();

            //change url to home page
            expect($location.path()).toBe('/tab/orderDetial')

    })

})
  