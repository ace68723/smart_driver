var express         = require('express');
var expressJwt      = require('express-jwt');
var cors            = require('cors');
var bodyParser      = require('body-parser');
var Q               = require('q');
var _               = require('lodash');

var mysql           = require('./connection/dbMysql');
var pool            = (new mysql).pool;
var Promise         = require("bluebird");
var ifLogin         = require("./interface/ifLogin");
var ifNode2         = require("./interface/ifNode2");
var ifDriver        = require("./interface/ifDriver");
var ifRr            = require("./interface/ifRr");

var node2           = require("./node2");

var smartApp        = express();

smartApp.use(cors());
smartApp.use(bodyParser.json());

var login   = new ifLogin(pool);
var rr      = new ifRr(pool);
var secret;

//init secret
var getSecret   =   function() {
    login.getSecret().then(function(result) {
        console.log(result.secret)
        secret = result.secret;    
    })

};

getSecret();

//init secret end

smartApp.get('/test12', function(req, res) {
   
   var driver = new ifDriver(pool); 
   driver.checkin('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIzLCJleHBpcmVkIjoiMjAxNS0wNy0wNiAxNjowNToxNCIsImlhdCI6MTQzMzYyMTExNH0.XlsTYCL2k91Z9t2mh1hkrl4n44LXkv4gdHfztG6t9yM', '8')
    .then( function(result) {
     console.log(result);
   })
    driver.checkin('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI0LCJleHBpcmVkIjoiMjAxNS0wNy0wNiAxNjowNToyMyIsImlhdCI6MTQzMzYyMTEyM30.Z0Btz-R2ip-GZ4BgcTPN93MOMt1omCJuX_O_gyDB78U', '8')
    .then( function(result) {
     console.log(result);
   })
});

smartApp.post('/tool', function(req, res) {
    
    //update secret
   getSecret();
   res.status(200).send('ok')
})


smartApp.post('/login', function(req, res) {
    
    var user = req.body;
    console.log(user);

    var name        = user.username;
    var password    = user.password;
    
    //check secret
    if (!secret) {
        getSecret();
    };

    login.login(name,password,secret).then(function(result) {
        console.log('login')
        console.log(result)
        res.status(200).send(result)
    })
    .catch(function(error) {
        console.log(error);
         res.status(401).send(error)
    })




})

smartApp.post('/authorize', function(req, res) {
    
    var authorize = req.body;
    console.log(authorize);

    var token        = authorize.token;

    //check secret
    if (!secret) {
        getSecret();
    };

    login.authorize(token,secret).then(function(result) {
            console.log(result)
            res.status(200).send(result)
        })
        .catch(function(error) {
            console.log(error);
            res.status(401).send(error)
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
    // var headers          = req.headers;
    // var authorizationSplit   = headers.authorization.split(" ", 2);
    // var token                = authorizationSplit[1]
    // get token to identity user
        var node2       = new ifNode2( ); 
        var addresses   = [];
        var point_list  = [];
        node2.getTable( 'Path' )
            .then(function(result) {
                paths = result;
                _.forEach(paths, function(path, key) {
                    var point = {'point_data': path.start}
                    point_list.push(point);
                    var point = {'point_data': path.end}
                    point_list.push(point);
                });
                
                var uniq_addresses = _.uniq(point_list,'point_data');
                 
                 _.forEach(uniq_addresses,function(point, key) {
                    addresses.push(point.point_data)
                 })
                res.status(200).send({
                    addresses: addresses
                })
            })
            .catch(function(error) {
                res.status(400).send({
                    addresses:'error'
                })
            })




})

smartApp.post('/preorder', function(req, res) {
    // var headers          = req.headers;
    // var authorizationSplit   = headers.authorization.split(" ", 2);
    // var token                = authorizationSplit[1]
    
    var preorder    = req.body;
    
    console.log(req.body);

    var iv_lat  = preorder.lat;
    var iv_lng  = preorder.lng;
    var iv_clat = preorder.clat;
    var iv_clng = preorder.clng;
    var ia_path = preorder.path;

    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;

    rr.preorder(iv_token, iv_secret, iv_lat, iv_lng, iv_clat, iv_clng, ia_path)
        .then( function (result) {
            res.status(200).send(result);
    })
        .catch(function(error){
            res.status(400).send(error);
    });

})

smartApp.post('/order', function(req, res) {
    // var headers          = req.headers;
    // var authorizationSplit   = headers.authorization.split(" ", 2);
    // var token                = authorizationSplit[1]
    
    var order    = req.body;
    
    console.log(req.body);

    var iv_addr     =   order.addr;
    var iv_city     =   order.city;
    var iv_unit     =   order.unit;
    var iv_postal   =   order.postal;
    var iv_tel      =   order.tel;
    var iv_name     =   order.name;
    var iv_price    =   order.price;
    var iv_paytype  =   order.paytype;
    var iv_charge   =   order.charge;
    var iv_lat      =   order.lat;
    var iv_lng      =   order.lng;
    var iv_clat     =   order.clat;
    var iv_clng     =   order.clng;
    var iv_tips     =   order.tips;
    var iv_ready    =   order.ready;

    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;

    rr.order(iv_token, iv_secret, iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_price, iv_paytype, iv_charge, iv_tips, iv_ready, iv_clat, iv_clng)
      .then( function (result) {
        var deferred = Q.defer();
            node2.getTables()
                .then(function(result) {
                    deferred.resolve(result);
                })
                .then(function(error) {
                    deferred.reject(error);
                });
        return deferred.promise;
    })
      .then(function() {
        res.status(200).send(result);
    })
      .catch(function(error){
        res.status(400).send(error);
    });

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
// var addresses = [ "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094",
//                   "43.825466, -79.288094"
//                 ];
