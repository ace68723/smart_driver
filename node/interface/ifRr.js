var ifLogin = require("./../interface/ifLogin");
var ifNode2 = require("./../interface/ifNode2");
var modelUser = require("./../model/mysqlUser");
var modelOrder = require("./../model/mysqlOrder");
var modelAddress = require("./../model/mysqlAddress");

//var moment = require('moment');
var Promise = require('bluebird');

function Rr(pool) { 
    
    this.preorder = function(iv_token, iv_secret, iv_lat, iv_lng, iv_clat, iv_clng, ia_path) {
        return new Promise(function (resolve, reject) {
            var lr_login = new ifLogin;
            lr_login.authorize(iv_token, iv_secret).then( function(result) {
                if (result.uid != 0) {
                    
                    var node2 = new node2;
                    node2.setTable('Path', ia_path).then( function(node2_result) {
                        resolve(node2_result);
                    }).catch(function(e) {
                //            console.log("Exception " + e);
                        reject(e);
                    });
                    
                } else { 
                    reject('Token issue');
                }
            }).catch(function(e) {
        //            console.log("Exception " + e);
                reject(e);
            });
        });
    }
    
    this.order = function(iv_token, iv_secret, iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_price, iv_paytype, iv_charge, iv_clat, iv_clng){
        return new Promise(function (resolve, reject) {
            var lr_login = new ifLogin;
            lr_login.authorize(iv_token, iv_secret).then( function(result) {
                if (result.uid != 0) {
                    return result;
                } else { 
                    reject('Token issue');
                }
            }).then(function(result) {
                var address = new modelAddress;
                var lv_uid = result.uid;
                address.create(iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name).then( function(result) {
                    var order = new modelOrder; 
                    order.create(lv_uid, result.aid , iv_price, iv_paytype, iv_charge).then( function(result) {
                        var la_task = [];
                        var lo_task = { };
                        lo_task.tid = '0,0,0,0,'+iv_lat+','+iv_lng+(new Date());
                        var lv_depend_id = lo_task.tid ;
                        lo_task.location = iv_lat+','+iv_lng;              
                        lo_task.deadline = ;
                        lo_task.ready = ;
                        lo_task.depend = null;
                        la_task.push(lo_task);
                        
                        lo_task = { };
                        lo_task.tid = iv_lat+','+iv_lng+','+iv_clat+','+iv_clng+(new Date());
                        lo_task.location = iv_clat+','+iv_clng;              
                        lo_task.deadline = ;
                        lo_task.ready = ;
                        lo_task.depend = lv_depend_id;
                        la_task.push(lo_task);
                        
                        redis.sortSet('Task', la_task).then( function (lr_task){
                            resolve(0);
                        }).catch(function(e) {
                            reject(e);
                        });

                    }).catch(function(e) {
                        console.log("Exception " + e);
                        reject(e);
                    });


                }).catch(function(e) {
                        console.log("Exception " + e);
                        reject(e);
                });

            }).catch(function(e) {
                reject(e);
            });   
        }); 
    }
    
    
    this.action = function(iv_token, iv_oid, iv_action ) {
        
    }
    
	
}; 

module.exports = Rr;
