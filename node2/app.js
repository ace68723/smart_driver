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

