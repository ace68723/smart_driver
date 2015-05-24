var express         = require('express');
var expressJwt      = require('express-jwt');
var cors            = require('cors');
var bodyParser      = require('body-parser');


var mysql           = require('./connection/dbMysql');
var pool            = (new mysql).pool;
var Promise         = require("bluebird");
var ifLogin         = require("./interface/ifLogin");
var ifNode2         = require("./interface/ifNode2");
var ifDriver        = require("./interface/ifDriver");

var smartApp        = express();

smartApp.use(cors());
smartApp.use(bodyParser.json());

var login = new ifLogin(pool);

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

    res.status(200).send({
        addresses: addresses
    })


})

smartApp.post('/preorder', function(req, res) {
    // var headers          = req.headers;
    // var authorizationSplit   = headers.authorization.split(" ", 2);
    // var token                = authorizationSplit[1]
    
    var preorder            = req.body;
    
    console.log(req.body);

    res.status(200).send({
        result  : 0,
        msg     : 'message',
        wait    : '50s',
        charge  : '50'
    })

})
smartApp.post('/order', function(req, res) {
    // var headers          = req.headers;
    // var authorizationSplit   = headers.authorization.split(" ", 2);
    // var token                = authorizationSplit[1]
    
    var order               = req.body;
    
    console.log(req)

    res.status(200).send({
        result  : 0,
        message : 'message'
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
