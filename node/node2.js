
var moment 			= require('moment');
var jobSchedule 	= require('./models/jobscheduling/build/Release/jobSchedule');
var ifNode2         = require("./interface/ifNode2");

var node2 = new ifNode2( ); 

var drivers;
var tasks;
var paths;

   	node2.getTable( 'Task' ).then( function(result) {
     	tasks = result;
     	consoel.log(tasks)
   	})


var drivers = [
{ 	"did": "Xunrui", 
	"available": 1432516683235, 
	"off": 1432519683235, 
	"location": "43.624203,-79.485100"
},

{ 	"did": "Aiden", 
	"available": 1432516683235, 
	"off": 1432519683235,  
	"location": "43.624203,-79.485100"}
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

