'use strict';

describe('homeService',function  () {
     var homeService, postService, $httpBackend, $location, $timeout, $firebase;
     var user = {'userName': 'test',
                    'password': 'test123'};
     beforeEach(module("HomeService"));
     beforeEach(module("PostServiceTest"));
     beforeEach(module("mock.firebase"));
     
     beforeEach(inject(function  ( _homeService_, _postService_, _$httpBackend_, _$location_, _$timeout_, _$firebase_) {
         
          homeService = _homeService_;
          
          postService = _postService_;

          $httpBackend = _$httpBackend_;

          $location = _$location_;

          $timeout = _$timeout_;

          $firebase = _$firebase_;

     }));
    it('should have a valid FBURL', function() {
        expect(homeService.FBURL).toMatch(/^https:\/\/[a-zA-Z0-9_-]+\.firebaseio\.com\/[a-zA-Z0-9_-]+\/[0-9]$/i);

    });

    it('should define getOrderDetail function', function() {
    
      expect(homeService.getOrderDetail).toBeDefined();
     
    });

    it('should get local token rid and oid, and send them to orderdetail ', function() {

        var url ='orderdetail/';  

        var oid = 1

        var orderAuth = {} 

        orderAuth.token = window.localStorage.getItem("sv_token"); 
        orderAuth.rid = window.localStorage.getItem("sv_rid"); 
        orderAuth.oid = oid;

        var respond = {
               'result': 0}
        
        $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/orderdetail/', orderAuth).respond(200, respond);
        
        //call submit function
        homeService.getOrderDetail(oid)

        // $http are never called until $httpBackend.flush() is called in unit tests
        $httpBackend.flush();

        //get result 0; username and password are correct, login successful.
        expect(homeService.orderDetail.result).toBe(respond.result);

    });

    it('Token check successful', function() {

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
        homeService.getOrderDetail(oid)

        // $http are never called until $httpBackend.flush() is called in unit tests
        $httpBackend.flush();

        //get result 0; username and password are correct, login successful.
        expect(homeService.orderDetail.result).toBe(0);

    })

    it('Token check  fail', function() {

        var url ='orderdetail/';  

        var oid = 1

        var orderAuth = {} 

        orderAuth.token = window.localStorage.getItem("sv_token"); 
        orderAuth.rid = window.localStorage.getItem("sv_rid"); 
        orderAuth.oid = oid;

        var respond = {
               comment: "",
               dltype: 1,
               error_msg: "wrong",
               itmes:[],
               name: "gloria",
               oid: 7587,
               result: 1,
               tel: "6479279299",
               total: 39.72

            }
        
        $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/orderdetail/', orderAuth).respond(200, respond);
        
        //call submit function
        homeService.getOrderDetail(oid)

        // $http are never called until $httpBackend.flush() is called in unit tests
        $httpBackend.flush();

        //get result 1; Token check fail; get error message; hs.orderDetail should not be defined
        expect(homeService.orderDetail).not.toBeDefined();

        //get error message
        expect(postService.response.error_msg).toBe("wrong");

    })

    it('Token check successful and change the path to /tab/orderDetial', function() {

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
        homeService.getOrderDetail(oid)

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

    it('Token check  fail, the path still is /tab/home', function() {

        var url ='orderdetail/';  

        var oid = 1

        var orderAuth = {} 

        orderAuth.token = window.localStorage.getItem("sv_token"); 
        orderAuth.rid = window.localStorage.getItem("sv_rid"); 
        orderAuth.oid = oid;

        var respond = {
               comment: "",
               dltype: 1,
               error_msg: "wrong",
               itmes:[],
               name: "gloria",
               oid: 7587,
               result: 1,
               tel: "6479279299",
               total: 39.72

            }
        
        $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/orderdetail/', orderAuth).respond(200, respond);
        
        //call submit function
        homeService.getOrderDetail(oid)

        // $http are never called until $httpBackend.flush() is called in unit tests
        $httpBackend.flush();

        //get result 1; Token check fail; get error message; hs.orderDetail should not be defined
        expect(homeService.orderDetail).not.toBeDefined();

        //get error message
        expect(postService.response.error_msg).toBe("wrong");

         // $timeouts are never called until $timeout.flush() is called in unit tests
        // call time out and change the url
        $timeout.flush();

        //change url to home page
        expect($location.path()).toBe('')

    })

})