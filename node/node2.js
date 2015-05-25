
var moment 			= require('moment');
var Q 				= require('q');
// var jobSchedule 	= require('./models/jobscheduling/build/Release/jobSchedule');
var ifNode2         = require("./interface/ifNode2");

var node2 = new ifNode2( ); 

var drivers;
var tasks;
var paths;

   	node2.getTable( 'Task' ).then( function(result) {
     	tasks = result;
     	console.log(tasks)
   	})



var getTables = function() {
	var deferred = Q.defer();

	node2.getTable( 'Driver' )
		
		.then(function(result) {
     		drivers = result;
     		console.log(drivers)
     		return drivers
   		})
   		
   		.then(function() {
   			var deferred = Q.defer();//get task defer -T
			
			node2.getTable( 'Task' )
				.then(function(result) {
		     		tasks = result;
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
			
			node2.getTable( 'Path' )
				.then(function(result) {
		     		paths = result;
		     		console.log(paths)
		     		deferred.resolve(paths);//get Path resolve -P
		   		})
		   		.catch(function(error) {
		   			deferred.reject(error);//get Path reject -P
		   		})
		   		return deferred.promise;//return get Path promise -P
   		})

   		.then(function() {
   			console.log(drivers);
   			console.log(tasks);
   			console.log(paths);
   			deferred.resolve(drivers); //register resolve -R
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












var drivers = [
{ "did": "Xunrui", "available": 100, "off": 600, "location": "Chanmao Inc." },
{ "did": "Aiden", "available": 5, "off": 400, "location": "Chanmao Inc." }
];

var tasks = [ 
{ "tid":"order1-fetch", "location":"Chanmao Inc.", "deadline":110, "did":"", "depend":"" }, 
{ "tid":"order1-deliver", "location":"Client1", "deadline":210, "did":"", "depend":"order1-fetch" }, 
{ "tid":"order2-deliver", "location":"Client2", "deadline":310, "did":"Aiden", "depend":"" } 
];

var paths = [ 
{ "start":"Chanmao Inc.", "end":"Client1", "time":10},
{ "end":"Chanmao Inc.", "start":"Client1", "time":10},
{ "start":"Chanmao Inc.", "end":"Client2", "time":20},
{ "end":"Chanmao Inc.", "start":"Client2", "time":20},
{ "start":"Client1", "end":"Client2", "time":25},
{ "end":"Client1", "start":"Client2", "time":25}
];


function callbackFunc(str) {
	console.log(str);
}

jobSchedule.search(JSON.stringify({"curTime":10, "drivers":drivers, "tasks":tasks, "paths":paths}), callbackFunc);
//console.log(jobSchedule.search(JSON.stringify({"drivers":drivers, "tasks":tasks, "paths":paths})));

