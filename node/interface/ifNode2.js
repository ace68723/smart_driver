var Promise = require('bluebird');
var moment = require('moment');

var dbRedis = require('./../connection/dbRedis');
var client = (new dbRedis).client;

var modelRedis = require("./../model/modelRedis");


function Node2( ) { 
    
    this.delItem = function( iv_name, ia_key ) {
        return new Promise(function (resolve, reject) {
            console.log(ia_key);
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

                    var la_key = [ ];
                    redis.getAll(1, lv_name).then( function (task_result){
                        for(var lv_task in task_result){
                            var lo_task = JSON.parse(task_result[lv_task]);
                            for (var lv_key in ia_key){
                                if (ia_key[lv_key] == lo_task.tid) la_key.push(task_result[lv_task]);
                            }
                        }
                        redis.sortDel(lv_name, la_key).then( function (sort_result){
                            resolve(0);
                        }).catch(function(e) {
                            reject(e);
                        });   

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
                            lo_data.time = Number(lo_result.time);
                            ea_data.push( lo_data );
                        }
                        resolve(ea_data);
                        break;
                    case 'Driver':
                        for(var lv_result_i in result){
                            var lo_result =  JSON.parse(result[lv_result_i] );
                            var lo_data = { };
                            lo_data.did = lo_result.start;
                            lo_data.location = lo_result.location;
                            lo_data.available = lo_result.available;
                            lo_data.off = lo_result.off;
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
                                    var lo_task         = JSON.parse(task_result[lv_task_i]);
                                    var lo_data         = { };
                                    lo_data.tid         = lo_task.tid;
                                    lo_data.location    = lo_task.location;
                                    lo_data.deadline    = Number(lo_task.deadline);
                                    lo_data.ready       = Number(lo_task.ready);
                                    lo_data.depend      = null;
                                    lo_data.oid         = lo_task.oid;
                                    lo_data.did         = null;

                                    for (var lv_task_j in task_result){
                                        var lo_task_link  = JSON.parse(task_result[lv_task_j]);
                                        if (lo_task.depend == lo_task_link.tid) 
                                                lo_data.depend = lo_task.depend;
                                                // console.log('depend vs ',lo_task.depend,' vs',lo_task_link.tid )  
                                    }

                                    if (assign_result != null) {
                                        for(var lv_assign_i in assign_result){
                                            var lo_assign = JSON.parse(assign_result[lv_assign_i]);
                                            // console.log('assign_result',assign_result[lv_assign_i])
                                            if ( lo_assign.tid == lo_data.tid ) { 
                                                 // console.log('ifNode2 assign',lo_assign.tid == lo_data.tid, ' did',lo_assign.did)
                                                lo_data.did = lo_assign.did
                                            };
                                        }
                                    }
                                    ea_data.push( lo_data );
                                }
                             
                             }).then( function(result){
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
        // console.log('set reids order',ia_data)
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
        // console.log('ifnode2 updata result')
        return new Promise(function (resolve, reject) {
            var la_assign = [ ] ;
            var la_driver = [ ] ;
            var redis = new modelRedis(client);
            
            for(var lv_data in ia_data){
                var lo_data = ia_data[lv_data];
                // if (lo_data.updated == 1) {
                    var lo_driver = { };
                    lo_driver.did = lo_data.did;
                    lo_driver.available = lo_data.available;
                    lo_driver.location = lo_data.location;
                    lo_driver.off = lo_data.off;
                    lo_driver.curtask = lo_data.tids[0];
                    for(var lv_tid in lo_data.tids){
                        var lo_assign = { };
                        lo_assign.tid = lo_data.tids[lv_tid];
                        lo_assign.did = lo_driver.did;
                        la_assign.push( lo_assign );
                    }
                    la_driver.push( lo_driver );
                // }    
                
            }
            console.log('updateResult ia_data ',ia_data)
            console.log('updateResult ifNode2 ',la_driver.length)
            if (la_driver.length > 0) { 
                redis.hashSet('Driver', la_driver).then( function (result){
                    console.log('la_assign.length',la_assign.length)
                    if (la_assign.length > 0) { 
                        console.log('start delete reids')
                        redis.hashSet('Assign', la_assign).then( function (result){
                            console.log(' delete reids done')
                            resolve(la_assign);
                        }).catch(function(e) {
                            reject(e);
                        });
                    }else if (la_assign.length === 0){
                        resolve('finish all tasks');
                    }else{
                        reject('la_assign.length < 0');
                    }
                }).catch(function(e) {
                    reject(e);
                });
                          
            }else{
                reject('la_driver.length < 0');
            }
        });
    }  

    this.getTask = function() {
        return new Promise(function (resolve, reject) {
            console.log('ifnode2 gettask')
            var redis = new modelRedis(client);
            var lv_task = 'Task' + (moment(new Date())).format("YYYYMMDD");
            
            redis.getAll(1, lv_task).then( function (tasks_result){
                
                resolve(tasks_result)

            })
            .catch(function(e) {
                reject(e);
            });
        })
    }         
            
};   



module.exports = Node2;
