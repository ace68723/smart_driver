
var moment 			  = require('moment');
var Q 				    = require('q');
var jobSchedule 	= require('./models/jobscheduling/build/Release/jobSchedule');
var ifNode2       = require("./interface/ifNode2");
var fs            = require('fs');

var node2 = new ifNode2( ); 

var drivers;
var tasks;
var paths;

   	node2.getTable( 'Task' ).then( function(result) {
     	tasks = result;
     	console.log(tasks)
   	})

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
                        console.log('done')
                        deferred.resolve(result);
                })
                    .catch(function(error) {
                         console.log('error')
                        deferred.reject(error);
                })

            return deferred.promise;                    
    })
        .then(function() {
            deferred.resolve('done');
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




module.exports = {getTables:getTables};




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

