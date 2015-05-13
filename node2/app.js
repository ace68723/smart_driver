var redis 			= require('redis');
//connect redis
// var client 			= redis.createClient();
//connect redis end
var moment 			= require('moment');
var jobSchedule 	= require('jobscheduling/build/Release/jobSchedule');


// client.on('connect', function() {
//     console.log('connected');
// });

// var now = moment(new Date());
// var current_date = now.format("YYYYMMDD");
// console.log(current_date)

//  	var array_task = [ 'array_task',20, JSON.stringify({time:10} )];
 	

//  	client.zadd(array_task, function (err, response) {
//  	    if (err) throw err;
//  	    console.log('added '+response+' items.');
//         });

//  	var args1 = [ 'array_task', '+inf', '-inf' ];

//  	client.ZRANGE('array_task', 0, -1,  function (err, response) {
//         if (err) throw err;
//         console.log('example1', response);
//         // write your code here
//     });



// var jobSchedule = require('./build/Release/jobSchedule');

var drivers = [
{ "ID": "Xunrui", "avlbTime": 0, "offTime": 600, "venue": "Chanmao Inc." },
{ "ID": "Aiden", "avlbTime": 100, "offTime": 400, "venue": "Chanmao Inc." }
];

var tasks = [ 
{ "ID":"order1-fetch", "venue":"Chanmao Inc.", "deadline":110, "asgnDriver":"", "prevTaskID":"" }, 
{ "ID":"order1-deliver", "venue":"Client1", "deadline":210, "asgnDriver":"", "prevTaskID":"order1-fetch" }, 
{ "ID":"order2-deliver", "venue":"Client2", "deadline":310, "asgnDriver":"Aiden", "prevTaskID":"" } 
];

var paths = [ 
{ "src":"Chanmao Inc.", "dst":"Client1", "distance":10},
{ "dst":"Chanmao Inc.", "src":"Client1", "distance":10},
{ "src":"Chanmao Inc.", "dst":"Client2", "distance":20},
{ "dst":"Chanmao Inc.", "src":"Client2", "distance":20},
{ "src":"Client1", "dst":"Client2", "distance":25},
{ "dst":"Client1", "src":"Client2", "distance":25}
];

function callbackFunc(str) {
	console.log(str);
}

jobSchedule.search(JSON.stringify({"drivers":drivers, "tasks":tasks, "paths":paths}), callbackFunc);
//console.log(jobSchedule.search(JSON.stringify({"drivers":drivers, "tasks":tasks, "paths":paths})));



