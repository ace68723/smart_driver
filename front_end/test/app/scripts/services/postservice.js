'use strict';


angular.module('smartApp')
  .service('postService', function (API_URL,$http) {
  	var postService = this;
	
  	postService.post = function(data, url) {
  		// console.log(data)

  		return	$http.post(API_URL + url, data).
  				success(function(response, status, headers, config) {
  			      postService.response = response;
  			        // console.log( postService.response)
  			     
  			    }).
  			    error(function(response, status, headers, config) {
  			    	 // console.log(response)
  			    	 // console.log(status)
  			    	 // console.log(headers)
  			    	 // console.log(config)
  			    	 
  			      postService.response = 'Please Check Your Network!';

  			    });

  		  	};

  	postService.get = function(url) {

  		return	$http.get(API_URL + url).
  				success(function(response, status, headers, config) {
  			      postService.response = response;
  			        // console.log( postService.response)
  			    }).
  			    error(function(response, status, headers, config) {
  			    	 // console.log(response)
  			    	 // console.log(status)
  			    	 // console.log(headers)
  			    	 // console.log(config)
  			    	 
  			      postService.response = 'Please Check Your Network!';

  			    });
  	};




  });
