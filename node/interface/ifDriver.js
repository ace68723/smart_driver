var Promise = require("bluebird");
var moment = require('moment');
var ifLogin = require("./../interface/ifLogin");
var ifNode2 = require("./../interface/ifNode2");
var modelDriver = require('../model/mysqlDriver');
var modelUser = require("../model/mysqlUser");

var dbRedis = require('./../connection/dbRedis');
var client = (new dbRedis).client;
var modelRedis = require("./../model/modelRedis");

function Driver(ir_pool) { 

    this.checkin = function(iv_token, iv_secret) {
        return new Promise(function (resolve, reject) {
            var lr_login = new ifLogin(ir_pool);
            var node2 = new ifNode2;
            var eo_result = { };

            lr_login.authorize(iv_token, iv_secret).then( function(auth_result) {
                 
                 var lo_driver = { };
                 var la_driver = [ ] ;
                
                 lo_driver.did = String(auth_result.uid);
                 lo_driver.location = '43.6664587,-79.37461960000002';
                 lo_driver.available = parseInt(moment().format("x"));
                 lo_driver.off = parseInt(moment( moment().format("YYYY-MM-DD")+' 23:59:00'  ).format("x"));
                 lo_driver.curtask = null;
                 la_driver.push( lo_driver );
                 
                 node2.setTable( 'Driver', la_driver ).then( function (order_result){
                      eo_result.result = 0;
                      resolve(eo_result);
                 }).catch(function(e) {
                        console.log(e)
                      eo_result.result = 1;
                      eo_result.message = e;
                      reject(eo_result);
                 });                
                 
                
             }).catch(function(error_login) {
                    eo_result.result = 1;
                    eo_result.message = error_login;
                    console.log(eo_result)
                    reject(eo_result.message);
             });
        });
    }  
    
    this.action = function(iv_token, iv_secret, iv_tid, iv_action) {
        return new Promise(function (resolve, reject) {
               var lr_login = new ifLogin(ir_pool);
               var node2 = new ifNode2;
               var eo_result = { };
               var redis = new modelRedis(client);
               var lv_driver_name = redis.getTableName('Driver');
            
               lr_login.authorize(iv_token, iv_secret).then( function(auth_result) {
                   
                     if (iv_action == 1) {
                         
                        var eo_result = { };
                        var la_del_key = [ iv_tid ]; 
                        node2.delItem( 'Task', la_del_key ).then( function (order_result){
                            var la_driver_param = [ ];
                            la_driver_param.push( auth_result.uid );
                            redis.hashGet(lv_driver_name, la_driver_param).then( function (driver_result){
                                var la_driver = [ ] ;
                                var lo_driver = { };
                                var lo_data = JSON.parse(driver_result);
                                lo_driver.did = lo_data.did;
                                lo_driver.available = lo_data.available;
                                lo_driver.location = lo_data.location;
                                lo_driver.off = lo_data.off;
                                lo_driver.curtask = null;
                                la_driver.push( lo_driver );
                                redis.hashSet('Driver', la_driver).then( function (result){  
                                    eo_result.result = 0;
                                    resolve(eo_result);
                                }).catch(function(e) {
                                    eo_result.result = 1;
                                    eo_result.message = e;
                                    reject(eo_result);
                                });
                            }).catch(function(e) {
                                eo_result.result = 1;
                                eo_result.message = e;
                                reject(eo_result);
                            });
                            
                        }).catch(function(e) {
                            eo_result.result = 1;
                            eo_result.message = e;
                            reject(eo_result);
                        });

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

module.exports = Driver;
