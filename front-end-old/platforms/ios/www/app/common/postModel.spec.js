'use strict';


describe('posModelTest',function  () {
	
	var postService, $httpBackend;
	
	var user = {'userName': 'test',
     			'password': 'test123'};
	
	beforeEach(module("PostServiceTest"));
	
	beforeEach(inject(function  (_postService_, _$httpBackend_) {
		
		postService = _postService_;
		
		$httpBackend = _$httpBackend_;

	}));

	it('should post success', function() {
     	
     	var url ='login/';
     	
     	var respond = {
     	               'result': 1,
     	               'rid': 1,
     	               'uid': 2,
     	               'token': 'sdfkdkqikdkkqe',
     	               'error_msg': 'pasword'}
     	  
     	$httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/', user).respond(201, respond);
     	
     	//csll post function which has two parameters: user date and url.
     	postService.post(user,url);

 	    // $http are never called until $httpBackend.flush() is called in unit tests 
     	$httpBackend.flush();

     	//post successful, get respond from server
     	expect(postService.response.result).toBe(1);

     	expect(postService.response.uid).toBe(2);
    
    }),
		
	it('should be network ERROR!', function() {
			
			var url ='login/';
			
			var respond = {
		               'result': 1,
		               'rid': 1,
		               'uid': 2,
		               'token': 'sdfkdkqikdkkqe',
		               'error_msg': 'password'};

		    $httpBackend.expectPOST('http://chanmao.ca/?r=%20rrclient/login/',user).respond(401, respond);

		    //csll post function which has two parameters: user date and url.
		    postService.post(user,url);
		   
	   	    // $http are never called until $httpBackend.flush() is called in unit tests 
      		$httpBackend.flush();
		    
		    //post fail, can not communicate with server, get http status code:4xx
		    expect(postService.response).toBe("Please Check Your Network!");
		   
	});
	 
})