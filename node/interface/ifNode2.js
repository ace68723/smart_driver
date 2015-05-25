var Promise = require('bluebird');
var moment = require('moment');

var dbRedis = require('./../connection/dbRedis');
var client = (new dbRedis).client;

var modelRedis = require("./../model/modelRedis");


function Node2( ) { 
    
    this.delItem = function( iv_name, ia_key ) {
        return new Promise(function (resolve, reject) {
            var redis = new modelRedis(client);
            var lv_name = redis.getTableName( iv_name );
            switch (iv_name){
                case 'Path':
                case 'Driver':
                case 'Assign':
                    redis.hashDel(lv_name, ia_key).then( function (hash_result){
                        resolve(0);
                    }).catch(function(e) {
                        reject(e);
                    });
                case 'Task':
                    redis.sortDel(lv_name, ia_key).then( function (sort_result){
                        resolve(0);
                    }).catch(function(e) {
                        reject(e);
                    });
            }
        });
    };
    
    
    this.getTable = function( iv_name ) {
        return new Promise(function (resolve, reject) {
            
            var ea_data = [ ] ;
            
            var redis = new modelRedis(client);
            var lv_tb_type = ( iv_name == 'Task' ) ? 1 : 2;
            var lv_name = iv_name + (moment(new Date())).format("YYYYMMDD");
            
            redis.getAll(lv_tb_type, lv_name).then( function (result){
                switch (iv_name){
                    case 'Path':
                        
                        for(var lv_result_i in result){
                            var lo_result =  JSON.parse(result[lv_result_i] );
                            var lo_data = { };
                            lo_data.start = lo_result.start;
                            lo_data.end = lo_result.end;
                            lo_data.time = lo_result.time;
                            ea_data.push( lo_data );
                        }
                        resolve(ea_data);
                        break;
                    case 'Driver':
                        for(var lv_result_i in result){
                            var lo_result =  JSON.parse(result[lv_result_i] );
//                            var lo_data = { };
//                            lo_data.start = lo_result.start;
//                            lo_data.end = lo_result.end;
//                            lo_data.time = lo_result.time;
                            ea_data.push( lo_result );
                        }     
                        resolve(ea_data);
                        break;
                    case 'Task':
                        var lv_task = 'Task' + (moment(new Date())).format("YYYYMMDD");
                        var lv_assign = 'Assign' + (moment(new Date())).format("YYYYMMDD");
                        redis.getAll(2, lv_assign).then( function (assign_result){
                            
                            redis.getAll(1, lv_task).then( function (task_result){
                            
                                for(var lv_task_i in task_result){
                                    var lo_task = JSON.parse(task_result[lv_task_i]);
                                    var lo_data = { };
                                    lo_data.tid   = lo_task.tid;
                                    lo_data.location = lo_task.location;
                                    lo_data.deadline = lo_task.deadline;
                                    lo_data.ready = lo_task.ready;
                                    lo_data.depend = lo_task.depend;
                                
                                    if (assign_result != null) {
                                        for(var lv_assign_i in assign_result){
                                            var lo_assign = JSON.parse(task_result[lv_task_i]);
                                            if ( lo_assign.tid == lo_data.tid ) { lo_data.did = lo_assign.did; };
                                        }
                                    } else {
                                        lo_data.did = '';
                                    }
                                    console.log('YY');
                                    ea_data.push( lo_data );
                                }
                             
                             }).then( function(result){
                                console.log('done');
                                resolve(ea_data);    
                             }).catch(function(e) {
                                    reject(e);
                             });
                        
                        }).catch(function(e) {
                            reject(e);
                        });
                        
                    
                }
                
                
            }).catch(function(e) {
                reject(e);
            });
        });
    }  

    this.setTable = function( iv_name, ia_data ) {

        return new Promise(function (resolve, reject) {
            var redis = new modelRedis(client);
//            var lv_name = iv_name + (moment(new Date())).format("YYYYMMDD");
            if (iv_name == 'Task') {
                redis.sortSet(iv_name, ia_data).then( function (result){
                    resolve(result);
                }).catch(function(e) {
                    reject(e);
                });
            } else {
                console.log(iv_name);
                redis.hashSet(iv_name, ia_data).then( function (result){
                    resolve(result);
                }).catch(function(e) {
                    reject(e);
                });
            }
         });
    }  
    
    
    this.updateResult = function( ia_data ) {
        
        return new Promise(function (resolve, reject) {
            var la_assign = [ ] ;
            var la_driver = [ ] ;
            var redis = new modelRedis(client);
            
            for(var lv_data in ia_data){
                var lo_data = ia_data[lv_data];
                if (lo_data.updated == 1) {
                    var lo_driver = { };
                    lo_driver.did = lo_data.did;
                    lo_driver.available = lo_data.available;
                    lo_driver.location = lo_data.location;
                    lo_driver.off = lo_data.off;
                    for(var lv_tid in lo_data.tid){
                        var lo_assign = { };
                        lo_assign.tid = lo_data.tid[lv_tid];
                        lo_assign.did = lo_driver.did;
                        la_assign.push( lo_assign );
                    }
                    la_driver.push( lo_driver );
                }    
                
            }
            if (la_driver.length > 0) { 
                redis.hashSet('Driver', la_driver).then( function (result){
                    if (la_assign.length > 0) { 
                        redis.hashSet('Assign', la_assign).then( function (result){
                            resolve(result);
                        }).catch(function(e) {
                            reject(e);
                        });
                    }
                }).catch(function(e) {
                    reject(e);
                });
                           
            }
        });
    }            
            
};   



module.exports = Node2;
