
var moment 			  = require('moment');
var Q 				  = require('q');
var _                 = require('lodash');
var jobSchedule 	  = require('./models/jobscheduling/build/Release/jobSchedule');
var ifNode2           = require("./interface/ifNode2");
var fs                = require('fs');
var Firebase          = require('firebase');
var dataRef           = new Firebase('https://ajaxsmart.firebaseio.com/');
var rrclient_ref      = dataRef.child('rrclient');
var drivers_ref       = dataRef.child('drivers');

var node2 = new ifNode2( ); 

var drivers;
var tasks;
var paths;

   	// node2.getTable( 'Task' ).then( function(result) {
    //  	tasks = result;
    //  	console.log(tasks)
   	// })

var drivers = [
    { "did": "23", "available": 1433625957749, "off": 1433642400000, "location": "43.825466,-79.288094" },
    { "did": "Aiden", "available": 1433625957749, "off": 1433642400000, "location": "43.825466,-79.288094" }
];

var getTables = function() {
	var deferred = Q.defer();

	node2.getTable( 'Driver' )
		
		.then(function(result) {
            console.log('get driver')
     		drivers = result;

            fs.writeFile('drivers.json', JSON.stringify(drivers, null, 4), function(err) {
                if(err) {
                   console.log(err)
                } else {
                    console.log("JSON drivers saved")
                }
            }); 

     		console.log(drivers)
     		return drivers
   	})
   		
   		.then(function() {
   			var deferred = Q.defer();//get task defer -T
			console.log('get Task')
			node2.getTable( 'Task' )
				.then(function(result) {
		     		tasks = result;

                    fs.writeFile('tasks.json', JSON.stringify(tasks, null, 4), function(err) {
                        if(err) {
                           console.log(err)
                        } else {
                            console.log("JSON tasks saved")
                        }
                    }); 

		     		console.log(tasks)
		     		deferred.resolve(tasks);//get task resolve -T
		   		})
		   		.catch(function(error) {
		   			deferred.reject(error);//get task reject -T
		   		})
		   		return deferred.promise;//return get taskpromise -T
   	})

   		.then(function() {
   			var deferred = Q.defer();//get Path defer -P
			console.log('get Path')
			node2.getTable( 'Path' )
				.then(function(result) {
		     		paths = result;
                    
                    fs.writeFile('paths.json', JSON.stringify(paths, null, 4), function(err) {
                        if(err) {
                           console.log(err)
                        } else {
                            console.log("JSON paths saved")
                        }
                    }); 

		     		console.log(paths)
		     		deferred.resolve(paths);//get Path resolve -P
		   		})
		   		.catch(function(error) {
		   			deferred.reject(error);//get Path reject -P
		   		})
		   		return deferred.promise;//return get Path promise -P
   	})

   		.then(function() {
            var deferred = Q.defer();
       			// console.log(drivers);
       			// console.log(tasks);
       			// console.log(paths);
                console.log('call algorithm')
       			var d         = new Date();
       			var curTime   = d.getTime();
                var data      = {"curTime":curTime, "drivers":drivers, "tasks":tasks, "paths":paths}
       			
                jobSchedule.search(JSON.stringify(data), function(str) {
                    var array = JSON.parse(str)
                    console.log(array)
                    fs.writeFile('jobs.json', JSON.stringify(array, null, 4), function(err) {
                        if(err) {
                           console.log(err)
                        } else {
                            console.log("JSON jobs saved")
                        }
                    }); 

                    deferred.resolve(array);
                });

            return deferred.promise;           
   	})
        .then(function(array) {
            var deferred = Q.defer();
                console.log('update result')
                
                node2.updateResult(array.schedules)
                    .then(function(result) {
                        console.log('update done')
                        deferred.resolve(array);
                })
                    .catch(function(error) {
                         console.log('error')
                        deferred.reject(error);
                })

            return deferred.promise;                    
    })
        .then(function(array) {
                console.log('before fb driver',array.schedules[0].tids)
                set_fb_driver(array.schedules).then(function() {
                     deferred.resolve('done');
                     console.log('all done')
                });
               
    })

   	.catch(function(error) {
   			console.log('error all',error);
   			deferred.reject(error);//register reject -R
   	})

   	.finally(function() {
   			
   			console.log('finally')
   	})

   	return deferred.promise;	
};

function set_fb_order(iv_uid,iv_oid, iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_price, iv_paytype, iv_charge, iv_tips, iv_ready, iv_clat, iv_clng, iv_status, iv_message) {
    var deferred = Q.defer();
        var set_data = {    addr    : iv_addr,
                            city    : iv_city,
                            unit    : iv_unit,
                            postal  : iv_postal, 
                            tel     : iv_tel,
                            name    : iv_name,
                            price   : iv_price,
                            paytype : iv_paytype,
                            charge  : iv_charge,
                            clat    : iv_clat,
                            clng    : iv_clng,
                            lat     : iv_lat, 
                            lng     : iv_lat,
                            ready   : iv_ready,
                            tips    : iv_tips,
                            status  : iv_status,
                            message : iv_message,
                            oid     : iv_oid
                        }
        console.log('set_fb_order',iv_oid)
        
        rrclient_ref.child(iv_uid).child('orders').child(iv_oid).set(set_data,function(error) {
            if (error) {

                deferred.reject(error)
            } else{
                deferred.resolve('save success')
            };
        });
    
    return deferred.promise;  
};

function set_fb_driver(schedules) {
    var deferred = Q.defer();
        _.forEach(schedules,function(schedule,key){
            var set_data = {    available   : schedule.available, 
                                did         : schedule.did, 
                                location    : schedule.location, 
                                off         : schedule.off, 
                                tids        : schedule.tids, 
                                updated     : schedule.updated
                            }

            console.log('set_fb_driver')
            
            drivers_ref.child(schedule.did).set(set_data,function(error) {
                if (error) {

                    deferredreject(error)
                }
            });
        })
        console.log('fb driver save success')
        deferred.resolve('save success')
    
    return deferred.promise;  
};

function get_fb_order(iv_uid){
    var deferred = Q.defer();
        rrclient_ref.child(iv_uid).on("value", function(snapshot) {
                var order = snapshot.val();
                if (order) {
                    deferred.resolve(order);
                } else{
                    deferred.reject('no data');
                };
                
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
                deferred.reject(errorObject.code);
            })
    return deferred.promise;
};

function get_fb_driver(iv_did){
    var deferred = Q.defer();
        drivers_ref.child(iv_did).on("value", function(snapshot) {
                var driver = snapshot.val();
                if (driver) {
                    deferred.resolve(driver);
                } else{
                    deferred.reject('no data');
                };
                
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
                deferred.reject(errorObject.code);
            })
    return deferred.promise;
};

function tid_to_oid(tid) {
    var deferred = Q.defer();//get task defer -T
    console.log('get Task')
    node2.getTable( 'Task' )
        .then(function(result) {
            var tasks_tids = result;
            console.log(tasks_tids)
            var oid = _.result(_.find(tasks_tids, {'tid':tid}), 'oid');
            deferred.resolve(oid);//get task resolve -T
        })
        .catch(function(error) {
            deferred.reject(error);//get task reject -T
        })
        return deferred.promise;//return get taskpromise -T
};

module.exports = {  getTables     :getTables,
                    set_fb_order  :set_fb_order,
                    get_fb_order  :get_fb_order,
                    get_fb_driver :get_fb_driver,
                    tid_to_oid    :tid_to_oid
                  };




// var drivers = [
// { "did": "Xunrui", "available": 1432532133879, "off": 1432532233879, "location": "43.7935476,-79.2931461" },
// { "did": "Aiden", "available": 1432532133879, "off": 1432532223879, "location": "43.7935476,-79.2931461" }
// ];

// var tasks = [ 
// { "tid":"order1-fetch", "location":"Chanmao Inc.", "deadline":1432519683235, "did":"", "depend":"" }, 
// { "tid":"order1-deliver", "location":"Client1", "deadline":1432519683235, "did":"", "depend":"order1-fetch" }, 
// { "tid":"order2-deliver", "location":"Client2", "deadline":1432519683235, "did":"Aiden", "depend":"" } 
// ];

// var paths = [ 
// { "start":"Chanmao Inc.", "end":"Client1", "time":10},
// { "end":"Chanmao Inc.", "start":"Client1", "time":10},
// { "start":"Chanmao Inc.", "end":"Client2", "time":20},
// { "end":"Chanmao Inc.", "start":"Client2", "time":20},
// { "start":"Client1", "end":"Client2", "time":25},
// { "end":"Client1", "start":"Client2", "time":25}
// ];




//console.log(jobSchedule.search(JSON.stringify({"drivers":drivers, "tasks":tasks, "paths":paths})));

