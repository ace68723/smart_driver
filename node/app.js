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
var modelUser       = require("./model/mysqlUser");


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
    .catch(function(error) {
        console.log(error)
    })
    driver.checkin('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI0LCJleHBpcmVkIjoiMjAxNS0wNy0wNiAxNjowNToyMyIsImlhdCI6MTQzMzYyMTEyM30.Z0Btz-R2ip-GZ4BgcTPN93MOMt1omCJuX_O_gyDB78U', '8')
    .then( function(result) {
     console.log(result);
   }).catch(function(error) {
        console.log(error)
    })
    res.status(200).send('ok')
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
smartApp.post('/driver_login', function(req, res) {
    
    var user = req.body;
    console.log(user);

    var name        = user.username;
    var password    = user.password;
    
    //check secret
    if (!secret) {
        getSecret();
    };

    // login.login(name,password,secret).then(function(result) {
    //     console.log('login')
    //     console.log(result)
    //     res.status(200).send(result)
    // })
    // .catch(function(error) {
    //     console.log(error);
    //      res.status(401).send(error)
    // })
    var test_data   = {};
    test_data.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIzLCJleHBpcmVkIjoiMjAxNS0wNy0wNiAxNjowNToxNCIsImlhdCI6MTQzMzYyMTExNH0.XlsTYCL2k91Z9t2mh1hkrl4n44LXkv4gdHfztG6t9yM'
    test_data.uid   = 23 
    res.status(200).send(test_data)


})
smartApp.post('/authorize', function(req, res) {
    
    // var authorize = req.body;
    // console.log(authorize);

    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;
    //check secret
    if (!secret) {
        getSecret();
    };

    login.authorize(iv_token,iv_secret).then(function(result) {
            console.log(result)
            res.status(200).send(result)
        })
        .catch(function(error) {
            console.log(error);
            res.status(401).send(error)
        })



})
smartApp.get('/register', function(req, res) {
     var lr_modelUser = new modelUser(pool);
    // var authorize = req.body;
    // console.log(authorize);

    var iv_secret   = secret;
    //check secret
    if (!secret) {
        getSecret();
    };
    var iv_username = 'aiden123';
    var iv_password = 'aiden1234';
    var iv_email    = '12312123@123.ca';
    var iv_name     = 'aiden';
    var iv_type     = '000';

    lr_modelUser.create(iv_username, iv_password, iv_email, iv_name, iv_type, iv_secret).then(function(result) {
            console.log(result)
            res.status(200).send(result)
        })
        .catch(function(error) {
            console.log(error);
            res.status(401).send(error)
        })



})

smartApp.get('/get_summary', function(req, res) {
    // var headers                = req.headers;
    // var authorizationSplit     = headers.authorization.split(" ", 2);
    // var token                  = authorizationSplit[1]
        // get token to identity user
    // console.log(token);
    // if (!secret) {
    //     getSecret();
    // };
    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;

    login.authorize(iv_token,iv_secret).then(function(auth_result) {
            console.log(auth_result)
            var iv_uid     = auth_result.uid;
            return iv_uid;
        })
        .then(function(iv_uid) {
            var deferred = Q.defer();
                node2.get_fb_order(iv_uid)
                    .then(function(order) {
                       deferred.resolve(order)
                    }) 
                    .catch(function(error) {
                        deferred.reject(error)
                    })
            return deferred.promise;      
        })
        .then(function(order) {
            res.status(200).send(order)
        })
        .catch(function(error) {
            console.log(error);
            res.status(401).send(error)
        })
    

})
smartApp.get('/get_driver', function(req, res) {
    // var headers                = req.headers;
    // var authorizationSplit     = headers.authorization.split(" ", 2);
    // var token                  = authorizationSplit[1]
        // get token to identity user
    // console.log(token);
    // if (!secret) {
    //     getSecret();
    // };
    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;

    login.authorize(iv_token,iv_secret).then(function(auth_result) {
            console.log(auth_result)
            var iv_uid     = auth_result.uid;
            var iv_did     = 23;
            return iv_did;
        })
        .then(function(iv_did) {
            var deferred = Q.defer();
                node2.get_fb_driver(iv_did)
                    .then(function(driver) {
                       deferred.resolve(driver)
                    }) 
                    .catch(function(error) {
                        deferred.reject(error)
                    })
            return deferred.promise;      
        })
        .then(function(driver) {
            res.status(200).send(driver)
        })
        .catch(function(error) {
            console.log(error);
            res.status(401).send(error)
        })
    

})
smartApp.post('/tid_to_oid', function(req, res) {
    // var headers                = req.headers;
    // var authorizationSplit     = headers.authorization.split(" ", 2);
    // var token                  = authorizationSplit[1]
        // get token to identity user
    // console.log(token);
    // if (!secret) {
    //     getSecret();
    // };
    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;

    var tid         = req.body.tid;

    login.authorize(iv_token,iv_secret).then(function(auth_result) {
            console.log(auth_result)
            var iv_uid     = auth_result.uid;
            var iv_did     = 23;
            return iv_did;
        })
        .then(function(iv_did) {
            var deferred = Q.defer();
                node2.tid_to_oid(tid)
                    .then(function(order_info) {
                        console.log(order_info)
                       deferred.resolve(order_info)
                    }) 
                    .catch(function(error) {
                        deferred.reject(error)
                    })
            return deferred.promise;      
        })
        .then(function(order_info) {
            res.status(200).send(order_info)
        })
        .catch(function(error) {
            console.log(error);
            res.status(401).send(error)
        })
    

})
smartApp.post('/action', function(req, res) {
    // var headers                = req.headers;
    // var authorizationSplit     = headers.authorization.split(" ", 2);
    // var token                  = authorizationSplit[1]
    // get token to identity user
    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;
    var iv_oid      = req.body.oid;
    var iv_action   = req.body.action;
    rr.action(iv_token, iv_secret, iv_oid, iv_action)
        .then(function(result) {
            res.status(200).send({
                result: result,
                msg   : 'message'
            })
        })
        .catch(function(error) {
            console.log(error)
        })




})
smartApp.post('/driver_action', function(req, res) {
    var driver = new ifDriver(pool); 
    // var headers                = req.headers;
    // var authorizationSplit     = headers.authorization.split(" ", 2);
    // var token                  = authorizationSplit[1]
    // get token to identity user
    var iv_token    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   = secret;
    var iv_tid      = req.body.tid;
    var iv_action   = req.body.action;
    console.log(req.body)
    driver.action(iv_token, iv_secret, iv_tid, iv_action)

        .then(function() {
            var deferred = Q.defer();
                node2.getTables()
                    .then(function(result) {
                        deferred.resolve(result);
                    })
                    .catch(function(error) {
                        deferred.reject(error);
                    });
            return deferred.promise;
        })
        .then(function(result) {
            res.status(200).send({
                result: result,
                msg   : 'message'
            })
        })
        .catch(function(error) {
            console.log(error)
        });




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
    var iv_status   =   0; 
    var iv_message  =   "New Order"; 
    var iv_token    =   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjIwLCJleHBpcmVkIjoiMjAxNS0wNi0yMSAwMDoxMDo0MyIsImlhdCI6MTQzMjI2Nzg0M30.xAPktfkYkQMIu3L1wkq4m13IpUk8OKyVvjK8IjR_nFo";
    var iv_secret   =   secret;

    rr.order(iv_token, iv_secret, iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_price, iv_paytype, iv_charge, iv_tips, iv_ready, iv_clat, iv_clng)
    .then( function (result) {
        var deferred = Q.defer();
        console.log('order result',result)
            var iv_oid = result.oid
            node2.getTables()
                .then(function(result) {
                    deferred.resolve(iv_oid);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
        return deferred.promise;

    })
    .then(function(iv_oid) {
        var deferred = Q.defer();
            login.authorize(iv_token,iv_secret)
                .then(function(auth_result) {
                    var iv_uid     = auth_result.uid;
                    var iv_oid_uid = {iv_oid:iv_oid,iv_uid:iv_uid}
                    console.log('get uid',iv_uid)
                    deferred.resolve(iv_oid_uid);
                })
                .catch(function(error) {
                        deferred.reject(error);   
                })
        return deferred.promise;        
    })
    .then(function(iv_oid_uid) {
        var iv_oid = iv_oid_uid.iv_oid;    
        var iv_uid = iv_oid_uid.iv_uid;
        var deferred = Q.defer();
            console.log('start set fb order')
            node2.set_fb_order(iv_uid,iv_oid,iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_price, iv_paytype, iv_charge, iv_tips, iv_ready, iv_clat, iv_clng, iv_status, iv_message)
                .then(function(result) {
                    deferred.resolve(result);
                    
                })
                .catch(function(error) {
                    deferred.reject(error);
                })
        return deferred.promise;        
    })
    .then(function(result) {
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
