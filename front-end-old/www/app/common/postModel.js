'use strict';

var PostService = angular.module('PostService', [],function config ($httpProvider) {
		
		$httpProvider.interceptors.push('authInterceptor');
	});

 PostService.service('postService', [ '$http','$cordovaProgress', function($http, $cordovaProgress) {
	var postService = this;
	
	postService.test ="this is postService";
	
	postService.post = function(data, url) {
		console.log(data)

		return	$http.post('http://localhost:3000/' + url, data).
				success(function(response, status, headers, config) {
			      postService.response = response;
			        console.log( postService.response)
			      // return postService.result;
			     
			    }).
			    error(function(response, status, headers, config) {
			    	 console.log(response)
			    	 console.log(status)
			    	 console.log(headers)
			    	 console.log(config)
			    	 
			      postService.response = 'Please Check Your Network!';

			      // return postService.result;
			      // $cordovaProgress.showText(false, 3000, postService.response.error_msg)
			    });
			     // return postService.result;
		  	};

	postService.get = function(url) {

		return	$http.get('http://localhost:3000/' + url).
				success(function(response, status, headers, config) {
			      postService.response = response;
			        console.log( postService.response)
			      // return postService.result;
			     
			    }).
			    error(function(response, status, headers, config) {
			    	 console.log(response)
			    	 console.log(status)
			    	 console.log(headers)
			    	 console.log(config)
			    	 
			      postService.response = 'Please Check Your Network!';

			      // return postService.result;
			      // $cordovaProgress.showText(false, 3000, postService.response.error_msg)
			    });
			     // return postService.result;
	};

	postService.testF = function  () {
		return postService.test
	}
}]);

PostService.service('authInterceptor',  function(){

	function addToken (config) {
		var token = '15651561'
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = 'Bearer ' + token;
		}
		return config;
	}

	return{
		request: addToken
	}
	
})
