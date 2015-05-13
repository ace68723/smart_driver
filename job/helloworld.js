var jobSchedule = require('./build/Release/jobSchedule');

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

console.log(jobSchedule.search(JSON.stringify({"drivers":drivers, "tasks":tasks, "paths":paths})));
