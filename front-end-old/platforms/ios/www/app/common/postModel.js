'use strict';

var PostService = angular.module('PostService', []);

 PostService.service('postService', [ '$http','$cordovaProgress', function($http, $cordovaProgress) {
	var postService = this;
	
	postService.test ="this is postService";
	
	postService.post = function(data, url) {
		console.log(data)

		return	$http.post('http://cmtest.littlesailing.com/index.php?r=rrclient/' + url, data).
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