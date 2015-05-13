var redis 			= require('redis');
var client 			= redis.createClient();
var moment 			= require('moment');
var jobSchedule 	= require('jobSchedule//build/Release/jobSchedule');


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



// var drivers = [
// { "ID": "Xunrui", "avlbTime": 0, "offTime": 600, "venue": "Chanmao Inc." },
// { "ID": "Aiden", "avlbTime": 100, "offTime": 400, "venue": "Chanmao Inc." }
// ];

// var tasks = [ 
// { "ID":"order1-fetch", "venue":"Chanmao Inc.", "deadline":110, "asgnDriver":"", "prevTaskID":"" }, 
// { "ID":"order1-deliver", "venue":"Client1", "deadline":210, "asgnDriver":"", "prevTaskID":"order1-fetch" }, 
// { "ID":"order2-deliver", "venue":"Client2", "deadline":310, "asgnDriver":"Aiden", "prevTaskID":"" } 
// ];

// var paths = [ 
// { "src":"Chanmao Inc.", "dst":"Client1", "distance":10},
// { "dst":"Chanmao Inc.", "src":"Client1", "distance":10},
// { "src":"Chanmao Inc.", "dst":"Client2", "distance":20},
// { "dst":"Chanmao Inc.", "src":"Client2", "distance":20},
// { "src":"Client1", "dst":"Client2", "distance":25},
// { "dst":"Client1", "src":"Client2", "distance":25}
// ];


// if (!k) {
// 	console.log('not')
// };

// var k = jobSchedule.search(JSON.stringify({"drivers":drivers, "tasks":tasks, "paths":paths}))

// if (k) {
// 	console.log('got it')
// };


var k;

timeout_test = function() {
	k=3
	setTimeout(function() {
		k=2
	},100)
	
};

test = function() {
	console.log(1)
	timeout_test() 
	console.log(k)
	console.log(4);

	setTimeout(function() {
		console.log(k, ' wait for timout')
	},100)
};

test();




