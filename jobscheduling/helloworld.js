var jobSchedule = require('./build/Release/jobSchedule');

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
