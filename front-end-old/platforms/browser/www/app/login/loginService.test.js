var LoginService = angular.module('LoginService',[]);

LoginService.service('loginService',['postService','$timeout','$location', function  (postService, $timeout, $location) {
	// ls = loginService
	var ls = this;
	ls.user = {};
	ls.postService = postService;
	


	ls.submit = function  (user) {
		//console.log(user);

		// $cordovaProgress.showBarWithLabel(true, 30000, "登陆中");
		ls.url ='login/'
		ls.postService.post(user, ls.url).then(function() {
			 // console.log(postService.result)
			 ls.response = postService.response;

			if ( ls.response.result == 0){
			 	 console.log(ls.response.result)

			  	window.localStorage.setItem("sv_uid",  ls.response.uid);
				window.localStorage.setItem('sv_rid',  ls.response.rid);
				window.localStorage.setItem('sv_token',  ls.response.token);
				
				$timeout(function() {
				         // $cordovaProgress.showSuccess(true, "登陆成功")
				    }, 3000);
				$timeout(function() {
				        // $cordovaProgress.hide()
				        $location.path( "/tab/home" );
				       
				    }, 4000);

			 } else{
			 	console.log( ls.response.error_msg)
			 	
			 	$timeout(function() {
				         // $cordovaProgress.showText(true, "登陆失败: " + postService.result.error_msg , 'center')
				    }, 3000);
				$timeout(function() {
				        // $cordovaProgress.hide()
				    }, 6000);
			 }
		})
	}
	
	ls.checkToken = function() {
		
		ls.user.token = window.localStorage.getItem("sv_token"); 
		ls.user.rid =  window.localStorage.getItem("sv_rid"); 
		// $cordovaProgress.showBarWithLabel(true, 30000, "登陆中");
		// Token fail test
		 // ls.user.token = "asdasd"

		// rid fail test
		// ls.user.rid =  5; 
		
		if (ls.user.token != null){
			console.log(ls.user)
				ls.url ='authorize/'
				ls.postService.post(ls.user, ls.url).then(function() {

					ls.response = postService.response;

					 if (ls.response.result == 0){
					 	// console.log(postService.result)
					 	// window.localStorage.setItem("sv_uid", postService.result.uid);
						// window.localStorage.setItem('sv_rid', postService.result.rid);
						// window.localStorage.setItem('sv_token', postService.result.token);
						
						// $cordovaProgress.showSuccess(true, "登陆成功")
						
						$timeout(function() {
						        // .hide()
						        $location.path( "/tab/home" );
						    }, 2000);

					 } else{
					 	ls.error_msg = ls.response.error_msg
					 	$timeout(function() {
						         // $cordovaProgress.showText(true, "登陆失败: " + postService.result.error_msg , 'center')
						    }, 3000);
						$timeout(function() {
						        // $cordovaProgress.hide()
						    }, 6000);
					 }
				})
		}else{
			return
		}
	}

	ls.logout = function() {
	  	window.localStorage.removeItem("sv_uid");
		window.localStorage.removeItem('sv_rid');
		window.localStorage.removeItem('sv_token');
		$location.path( "/login" );


	};
}])