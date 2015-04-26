ChanMao iPad - Restaurant System 

Css Document
	
-Background Image
	1.Image source: login/login.tpl.html: 2-4

		<div class = "lbg ">
			<img src="img/bg.jpg">
		</div>

	
2.Image Class "lbg" (login background)


	.lbg {
		z-index:-5;
		
	}
	.lbg:before {
		content: "";
		  position: fixed;
		  left: 0;
		  right: 0;
		  z-index: -1;
		  
		  display: block;
		  background-size: 100% 100%;
		  width: 100%;                                  /* size */
		  height: 100%;                                 /* size */
		  
		 /* -webkit-filter: blur(5px);                  /* blur */
		  -moz-filter: blur(5px);
		  -o-filter: blur(5px);
		  -ms-filter: blur(5px);
		  filter: blur(5px);*/
	}

-Frosted Glass Blur 
	1.login/login.tpl.html: 49


		<div class="glass"></div>

2.Class "glass" 
	style.css: 338-378
		
		.glass {
			position: absolute;    						/*position */
			padding: 10px 0;
			border-bottom: 1px solid;
			border-bottom-color: #ccc;
			border-bottom-color: rgba(255, 255, 255, 0.3);
			background-color: rgba(255, 255, 255, 0.3);
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
			height: 500px;     							 /* size */
			width: 104%;	   							 /* size */
			left: -1%;		   							 /* position */
			z-index: 0;		   							 /* position */
			top: 16%;		   							 /* position */
		}

		.glass::before {
		  position: absolute;
		  top: 0;
		  left: 0;
		  z-index: -1;
		  width: 100%;
		  height: 100%;
		  background-image: url('../img/bg.jpg');  		/* image source */
		  background-position: center bottom;
		  background-attachment: fixed;
		  background-size: cover;
		  content: "";
		  filter: url();
		  -webkit-filter: blur(15px); 					/* blur style */
		  filter: blur(15px);
		}

		.glass .legacy-ie-fix {
		  position: absolute;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background-color: #fff;
		  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=20)";
		}	

-Logo
1.login/login.tpl.html: 20-22

	<div class = "login-logo  " ng-class="{'animated': showLogin,'tada': showLogin}">
		<img src="http://chanmao.ca/img/logo.png">
	</div>

	2.Class "login-logo" 
		* "animated" "tada"  These two classes are in the animate.css library.
		* These classes will be activated once showLogin's value is true. 
	


		.login-logo{									 /* position */
			position: relative;
			top: 170px;
			left: 70px;
		}

-Login Form 
	1.login/login.tpl.html: 24-42

	<form name="loginForm" class ="login-form ">
	    <span class="input input--hoshi " ng-class="{'input--filled':loginForm.userName.$valid}">
	      <input class="input__field input__field--hoshi"  type="text" name="userName" ng-model="user.name" required  />
	      <label class="input__label input__label--hoshi input__label--hoshi-color-1" >
	        <span class="input__label-content input__label-content--hoshi ">User Name: </span>
	      </label>
	    </span>
	   <span class="input input--hoshi" ng-class="{'input--filled':loginForm.userPassword.$valid}">
	     <input class="input__field input__field--hoshi" type="password"  name="userPassword" ng-model="user.password" required/>
	     <label class="input__label input__label--hoshi input__label--hoshi-color-2">
	       <span class="input__label-content input__label-content--hoshi">Password:</span>
	     </label>
	   </span>
	    <button class="button button-login  button-energized">
	      LOGIN
	    </button>
	</form>

	1.1 From
	<form name="loginForm" class ="login-form ">
	...
	</form>



1.2 Span login/login.tpl.html: 25-29
 * Class: input, input--hoshi, input--filled 

```
<span class="input input--hoshi " ng-class="{'input--filled':loginForm.userName.$valid}">
  ...
</span>
```

1.2 Class "input" style.css 86-97
```
.input {
	position: relative;
	z-index: 1;
	display: inline-block;
/*	margin: 1em;*/	
	margin: 0;
	max-width: 100%;						/*size*/
	width: calc(100% - 2em);                /*size*/
	height: 90px; 							/*size*/
	vertical-align: top;
/*  new */
	
}
```

* Class "input" style.css 160-163
.input--hoshi {
	overflow: hidden;
	font-size:20px;
}
