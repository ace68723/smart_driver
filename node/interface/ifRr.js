var ifLogin = require("./../interface/ifLogin");
var ifNode2 = require("./../interface/ifNode2");
var modelUser = require("./../model/mysqlUser");
var modelOrder = require("./../model/mysqlOrder");
var modelAddress = require("./../model/mysqlAddress");

var moment = require('moment');
var Promise = require('bluebird');

function Rr(ir_pool) { 
    
    this.preorder = function(iv_token, iv_secret, iv_lat, iv_lng, iv_clat, iv_clng, ia_path) {
        return new Promise(function (resolve, reject) {
            var eo_result = { };
            var lr_login = new ifLogin(ir_pool);
            lr_login.authorize(iv_token, iv_secret).then( function(login_result) {
                    var node2 = new ifNode2;
                    var la_path = [ ];
                    for(var lv_item in ia_path){
                        var lo_path = { };
                       
                        lo_path.start = String(ia_path[lv_item].start).split(' ').join('');
                        lo_path.end = String(ia_path[lv_item].end).split(' ').join('');
                        lo_path.pid = lo_path.start+','+lo_path.end;
                        lo_path.time = String(ia_path[lv_item].duration);
                        la_path.push( lo_path );
                    }
                    
                    node2.setTable('Path', la_path).then( function(node2_result) {
                        
                        eo_result.result = 0;
                        resolve(node2_result);
                    }).catch(function(e) {
                        eo_result.result = 1;
                        eo_result.message = e;
                        reject(e);
                    });

            }).catch(function(e) {
                eo_result.result = 1;
                eo_result.message = 'error';
                reject(eo_result);
            });
        });
    }
    
    this.order = function(iv_token, iv_secret, iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_price, iv_paytype, iv_charge, iv_tips, iv_ready, iv_clat, iv_clng){
        
        return new Promise(function (resolve, reject) {
            var lr_login = new ifLogin(ir_pool);
            var node2 = new ifNode2;  
            var eo_result = { };
            lr_login.authorize(iv_token, iv_secret).then( function(auth_result) {
                   
                    var address = new modelAddress(ir_pool);
                    var lv_uid = auth_result.uid;
                    address.create(iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name).then( function(address_result) {
                        var order = new modelOrder(ir_pool);
                        order.create(lv_uid, address_result[0].aid, Number(iv_price), Number(iv_paytype), Number(iv_charge), 0, 0, Number(iv_tips), Number(iv_ready)).then( function(order_result) {
                            
                            
                            var la_task = [];
                            var lo_task = { };
                            
                            lo_task.oid = order_result.oid;
                            lo_task.tid = '0,0,'+iv_lat+','+iv_lng+','+moment(new Date()).utc();
                            var lv_depend_id = lo_task.tid ;
                            lo_task.location = iv_lat+','+iv_lng;              
                            lo_task.deadline = moment(new Date()).utc()+(iv_ready + 1800)*1000; 
                            lo_task.ready = moment(new Date()).utc()+iv_ready*1000;
                            lo_task.depend = null;
                            la_task.push(lo_task);
                            
                            lo_task = { };
                            lo_task.oid = order_result.oid;
                            lo_task.tid = iv_lat+','+iv_lng+','+iv_clat+','+iv_clng+','+moment(new Date()).utc();
                            lo_task.location = iv_clat+','+iv_clng;              
                            lo_task.deadline = moment(new Date()).utc()+(iv_ready + 5400)*1000; 
                            // lo_task.ready = moment(new Date()).utc()+iv_ready*1000; 
                            lo_task.ready   = 0;
                            lo_task.depend = lv_depend_id;
                            la_task.push(lo_task);
                            
                            node2.setTable('Task', la_task).then( function (redis_result){
                                eo_result.result = 0;
//                                eo_result.message = e;
                                resolve(order_result[0]);
                            }).catch(function(e) {
                                eo_result.result = 1;
                                eo_result.message = e;
                                reject(eo_result);
                            });

                        }).catch(function(e) {
                            eo_result.result = 2;
                            eo_result.message = e;
                            reject(eo_result);
                        });


                    }).catch(function(e) {
                        eo_result.result = 3;
                        eo_result.message = e;
                        reject(eo_result);
                    });

            }).catch(function(e) {
                eo_result.result = 4;
                eo_result.message = e;
                reject(eo_result);
            });   
        }); 
    }
    
    
    this.action = function(iv_token, iv_secret, iv_oid, iv_action ) {
        return new Promise(function (resolve, reject) {
           var lr_login = new ifLogin(ir_pool);
           var eo_result = { };
           var node2 = new node2;    
           lr_login.authorize(iv_token, iv_secret).then( function(auth_result) {
              if (auth_result.uid != 0) {    
                 if (iv_action == 1) {
                    var order = new modelOrder(ir_pool);
                    var eo_result = { };
                    order.findStartEnd( iv_oid ).then( function (order_result){


                        var la_task = [];
                        var lo_task = { };
                        lo_task.tid = '0,0,'+order_result.start_lat+','+order_result.start_lng+','+moment(new Date()).utc();
                        var lv_depend_id = lo_task.tid ;
                        lo_task.location = order_result.start_lat+','+order_result.start_lng;              
                        lo_task.deadline = moment(new Date()).utc()+(order_result.ready + 1800)*1000; 
                        lo_task.ready = moment(new Date()).utc()+order_result.ready*1000;
                        lo_task.depend = null;
                        la_task.push(lo_task);
                        
                        lo_task = { };
                        lo_task.tid = order_result.start_lat+','+order_result.start_lng+','+order_result.end_lat+','+order_result.end_lng+','+moment(new Date()).utc();
                        lo_task.location = order_result.end_lat+','+order_result.end_lng;              
                        lo_task.deadline = moment(new Date()).utc()+(order_result.ready + 5400)*1000; 
                        lo_task.ready = moment(new Date()).utc()+order_result.ready*1000;   
                        lo_task.depend = lv_depend_id;
                        la_task.push(lo_task);

                        

                        node2.setTable('Task', la_task).then( function (result_redis){
                            eo_result.result = 0;
                            eo_result.message = result_redis;
                            resolve(0);
                        }).catch(function(error_redis) {
                            eo_result.result = 1;
                            eo_result.message = error_redis;
                            reject(eo_result);
                        });
                        
                    }).catch(function(erro_order) {
                        eo_result.result = 1;
                        eo_result.message = erro_order;
                        reject(eo_result);
                    });

                 } 
              } else { 
                 eo_result.result = 1;
                 eo_result.message = auth_result;
                 reject(eo_result);
              }
           }).catch(function(e) {
                eo_result.result = 1;
                eo_result.message = e;
                reject(eo_result);
           });
        });
                  
    }
    
	
}; 

module.exports = Rr;
