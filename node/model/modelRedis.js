var Promise = require("bluebird");
var redis = require("redis");
var moment = require('moment');

function Redis(ir_client) { 
    
    this.getTableName = function ( iv_name ) {
        return (iv_name + (moment(new Date())).format("YYYYMMDD"));
    }
    
    this.getAll = function(iv_type, iv_tb_name) {
        return new Promise(function (resolve, reject) {
            if (iv_type == 1) {
                ir_client.hgetallAsync( iv_tb_name ).then( function(result){
//                    console.log( result);
                    resolve(result);
                }).catch(function(e) {
//                    console.log(e);
                    reject(e);
                });
            } else if (iv_type == 2) {
                ir_client.zrangeAsync( iv_tb_name, 0, -1 ).then( function(result){
//                    console.log( result);
                    resolve(result);
                }).catch(function(e) {
//                    console.log(e);
                    reject(e);
                });           
            } 
        }); 
    };   

    
    this.hashSet = function(iv_tb_name, ia_items) {
        return new Promise(function (resolve, reject) {
            var lv_tb_name = iv_tb_name + (moment(new Date())).format("YYYYMMDD");
            var la_param = [ lv_tb_name ];
            for (var i = 0; i < ia_items.length; i++) {
                var lj_item = ia_items[i]; 
                switch (iv_tb_name){
                    case 'Path':
                        la_param.push(lj_item.pid);
                    case 'Driver':
                        la_param.push(lj_item.did);
                    case 'Assign':
                        la_param.push(lj_item.tid);
                }
                        
                la_param.push(JSON.stringify(lj_item));        
            }
            ir_client.hmsetAsync( la_param ).then( function(result){
                resolve(result);
            }).catch(function(e) {
//                console.log(e);
                reject("error");
            });    
        }); 
    };

    this.hashGet = function(iv_tb_name, ia_key) {   
        return new Promise(function (resolve, reject) {
            var la_param = [ iv_tb_name ];
            for(var i = 0; i < ia_key.length; i++) {
                la_param.push( ia_key[i] );
            }

            ir_client.hmgetAsync( la_param ).then( function(result){
//                console.log( result);
                resolve(result);
            }).catch(function(e) {
//                console.log(e);
                reject(e);
            });   
        });
    };

    this.hashDel = function(iv_tb_name, ia_key) {   
        return new Promise(function (resolve, reject) {
            var la_param = [ iv_tb_name ];
            for(var i = 0; i < ia_key.length; i++) {
                la_param.push( ia_key[i] );
            }
            ir_client.hdelAsync( la_param ).then( function(result){
//                console.log( result);
                resolve(result);
            }).catch(function(e) {
//                console.log(e);
                reject(e);
            });   
        }); 
    };
    
    this.sortSet = function(iv_tb_name, ia_items) {
        return new Promise(function (resolve, reject) {
            var lv_tb_name = iv_tb_name + (moment(new Date())).format("YYYYMMDD");
            var la_param = [ lv_tb_name ];
            for(var i = 0; i < ia_items.length; i++) {
                var lj_item = ia_items[i];
                la_param.push( (new Date()).getTime());
                la_param.push( JSON.stringify( lj_item ) );
            }
            ir_client.zaddAsync( la_param ).then( function(result){
//                console.log( result);
                resolve(result);
            }).catch(function(e) {
//                console.log(e);
                reject(e);
            });    
        }); 
    };    

    this.sortDel = function(iv_tb_name, ia_key) {
        return new Promise(function (resolve, reject) {
            var la_param = [ iv_tb_name ];
            for(var i = 0; i < ia_key.length; i++) {
                la_param.push( ia_key[i] );
            }
            ir_client.zremAsync( la_param ).then( function(result){
                resolve(result);
            }).catch(function(e) {
                reject(e);
            });    
        }); 
    }; 
    
//    var now = moment(new Date());
//      var current_date = now.format("YYYYMMDD");
//      
//      var array_task = 'task' + current_date;
//      var array_driver = 'driver' + current_date;
//      var array_distance = 'distance' + current_date;
//      
//      for(var i = 0; i < req.body.task.length; i++) {
//        var item = req.body.task[i];
//        var args_task = [ array_task, (new Date()).getTime(), JSON.stringify(item ) ];
//        client.zadd(args_task, function (err, response) {
//            if (err) throw err;
//            console.log('added '+response+' items.');
//        });
//      }
//    
//      for(var i = 0; i < req.body.driver.length; i++) {
//        var item = req.body.driver[i];
//        var args_driver = [ array_driver, (new Date()).getTime(), JSON.stringify(item ) ];
//        client.zadd(args_driver, function (err, response) {
//            if (err) throw err;
//            console.log('added '+response+' items.');
//        });
//      }    
//    
//      for(var i = 0; i < req.body.distance.length; i++) {
//        var item = req.body.distance[i];
//        var args_distance = [ array_distance, (new Date()).getTime(), JSON.stringify(item ) ];
//        client.zadd(args_distance, function (err, response) {
//            if (err) throw err;
//            console.log('added '+response+' items.');
//        });
//      }
//
//      client.ZRANGE('array', 0, 0, function(err, replies) {
//          res.send(JSON.stringify(replies));
//      });
    
    
}; 

module.exports = Redis;
