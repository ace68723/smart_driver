var express 	= require('express');
var expressJwt 	= require('express-jwt');
var cors 		= require('cors');
var bodyParser 	= require('body-parser');

var mysql = require('./connection/dbMysql');
var pool = (new mysql).pool;
var Promise = require("bluebird");
var ifLogin = require("./interface/ifLogin");
var ifNode2 = require("./interface/ifNode2");
var ifDriver = require("./interface/ifDriver");
var ifRr = require("./interface/ifRr");


var dbRedis = require('./connection/dbRedis');
var client = (new dbRedis).client;
var modelRedis = require('./model/modelRedis');

var modelUser = require("./model/mysqlUser");
var modelParameter = require("./model/mysqlParameter");
var modelAddress = require("./model/mysqlAddress");
var modelOrder = require("./model/mysqlOrder");


var smartApp = express();

smartApp.use(cors());
smartApp.use(bodyParser.json());

smartApp.post('/login', function(req, res) {
	
	var user = req.body.username;
	console.log(user);

	res.status(200).send({
		result: 0,
            msg: 'message',
            token: 'test_token',
            lat: '43.589045',
            lng: '-79.644120',
            uid: '1'
	})

})
smartApp.get('/get_sumamry', function(req, res) {
      var headers                = req.headers;
      var authorizationSplit     = headers.authorization.split(" ", 2);
      var token                  = authorizationSplit[1]
      // get token to identity user
      console.log(token);
      res.status(200).send({
           actions:actions,
           orders:orders
      })


})

smartApp.get('/test22', function(req, res) {
   var node = new ifNode2( ); 
   node.getTable( 'Task' ).then( function(result) {
     console.log(result);
   })
      node.getTable( 'Driver' ).then( function(result) {
     console.log(result);
   })
         node.getTable( 'Path' ).then( function(result) {
     console.log(result);
   })
});

smartApp.get('/test11', function(req, res) {
   var login = new ifLogin(pool); 
   login.login('test6', 'asd8', '8').then( function(result) {
     console.log(result);
   })
});

smartApp.get('/test', function(req, res) {
    var iv_addr = "2620 Kennedy Road, Scarborough, ON M1T 3H1, Canada";
    var iv_city = "Scarborough";
    var iv_unit = "515";
    var iv_postal = "M1T 3H1";
    var iv_tel = "5197745881";
    var iv_name = "aiden";
    var iv_price = "35.99";
    var iv_paytype = "1";
    var iv_charge = "6.00";
    var iv_lat = "43.7935474";
    var iv_lng = "-79.2931461";
    var iv_clat = "43.7935478";
    var iv_clng = "-79.2931469";
    var iv_tips = "5.00";
    var iv_ready = "1800";

    var iv_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret = "8";
    var rr = new ifRr(pool);
    rr.order(iv_token, iv_secret, iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_price, iv_paytype, iv_charge, iv_tips, iv_ready, iv_clat, iv_clng).then( function (result) {
    
    }).catch(function(e){
        console.log(e);
    });
    
    
    
    
})



smartApp.get('/test3', function(req, res) {
//      var headers                = req.headers;
//      var authorizationSplit     = headers.authorization.split(" ", 2);
//      var token                  = authorizationSplit[1]
      // get token to identity user
    var rr = new ifRr(pool);
    
    var iv_lat = '43.825466';
    var iv_lng = '-79.288094';
    var iv_clat = '43.7935474' ;
    var iv_clng = '-79.2931461';
    var ia_path = [
        {
            start: '43.7935474, -79.2931461',
            end: '43.825466, -79.288094',
            duration: '505',
            distance: '5011'
        },
        {
            start: '43.7935475, -79.2931461',
            end: '43.825466, -79.288094',
            duration: '505',
            distance: '5011'
        },
        {
            start: '43.7935476, -79.2931461',
            end: '43.825466, -79.288094',
            duration: '505',
            distance: '5011'
        },
        {
            start: '43.7935477, -79.2931461',
            end: '43.825466, -79.288094',
            duration: '505',
            distance: '5011'
        }
    ]
    var iv_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret = "8";
    rr.preorder(iv_token, iv_secret, iv_lat, iv_lng, iv_clat, iv_clng, ia_path).then( function (result) {
    
    });
    
      console.log('k');
      res.status(200).send({
           actions:actions,
           orders:orders
      })


})


smartApp.post('/action', function(req, res) {
      var headers                = req.headers;
      var authorizationSplit     = headers.authorization.split(" ", 2);
      var token                  = authorizationSplit[1]
      // get token to identity user
      console.log(token);
      res.status(200).send({
            result: 1,
            msg   : 'message'
      })


})

smartApp.get('/get_addresses', function(req, res) {
	// var headers 			= req.headers;
	// var authorizationSplit 	= headers.authorization.split(" ", 2);
	// var token 				= authorizationSplit[1]
	// get token to identity user

	res.status(200).send({
		addresses: addresses
	})


})

smartApp.post('/preorder', function(req, res) {
	// var headers 			= req.headers;
	// var authorizationSplit 	= headers.authorization.split(" ", 2);
	// var token 				= authorizationSplit[1]
	
	var preorder 			= req.body;
	
	console.log(req.body);

	res.status(200).send({
		result	: 0,
		msg		: 'message',
		wait	: '50s',
		charge	: '50'
	})

})
smartApp.post('/order', function(req, res) {
	// var headers 			= req.headers;
	// var authorizationSplit 	= headers.authorization.split(" ", 2);
	// var token 				= authorizationSplit[1]
	
	var order 				= req.body;
	
	console.log(req)

	res.status(200).send({
		result	: 0,
		message	: 'message'
	})

})



smartApp.listen(3000, function() {
	console.log("smartJwt listening on 3000")
})


//for orders test
var summaryData = {};

var actions = [{ oid : 213,
                       price: 56,
                       reason: "Customer did't answer"
                       },
                       { oid : 237,
                       price: 42,
                       reason: "Restaurant Delay"
                       }
  ];

var orders = [{ oid : 213,
                       price: 56,
                       status: "Done"
                       },
                       { oid : 237,
                       price: 42,
                       status: "Delivering"
                       }
  ];



//for address test
var addresses = [ "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094",
                  "43.825466, -79.288094"
                ];
