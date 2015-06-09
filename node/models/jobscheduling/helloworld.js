var jobSchedule = require('./build/Release/jobSchedule');

var drivers = [
{ "did": "Xunrui", "available": 1432532133879, "off": 1432532233879, "location": "43.7935476,-79.2931461" },
{ "did": "Aiden", "available": 1432532133879, "off": 1432532223879, "location": "43.7935476,-79.2931461" }
//{ "did": "Xunrui", "available": 1432516683235, "off": 1432519683235, "location": "Chanmao Inc." },
//{ "did": "Aiden", "available": 1432516683235, "off": 1432519683235, "location": "Chanmao Inc." }
];

var tasks = [ { tid: '0,0,43.825466,-79.288094,1432600835310',
    location: '43.825466,-79.288094',
    deadline: 1450615243511,
    ready: 1432615243511,
    depend: null,
    did: '' },
  { tid: '43.825466,-79.288094,43.7935474,-79.2931461,1432600835310',
    location: '43.7935474,-79.2931461',
    deadline: 1450618843511,
    ready: 1432615243511,
    depend: '0,0,43.825466,-79.288094,1432600835310',
    did: '' } ];
//[ 
//{ "tid":"order1-fetch", "location":"Chanmao Inc.", "deadline":1432519683235, "did":"", "depend":null }, 
//{ "tid":"order1-deliver", "location":"Client1", "deadline":1432519683235, "did":"", "depend":"order1-fetch" }, 
//{ "tid":"order2-deliver", "location":"Client2", "deadline":1432519683235, "did":"Aiden", "depend":"" } 
//];

var paths = [ { start: '43.7935476,-79.2931461',
    end: '43.7935474,-79.2931461',
    time: 505 },
  { start: '43.7935474,-79.2931461',
    end: '43.7935476,-79.2931461',
    time: 505 },
  { start: '43.7935474,-79.2931461',
    end: '43.825466,-79.288094',
    time: 505 },
  { start: '43.7935476,-79.2931461',
    end: '43.825467,-79.288094',
    time: 505 },
  { start: '43.825466,-79.288094',
    end: '43.7935474,-79.2931461',
    time: 505 },
  { start: '43.825467,-79.288094',
    end: '43.7935476,-79.2931461',
    time: 505 } ];
//[ 
//{ "start":"Chanmao Inc.", "end":"Client1", "time":10},
//{ "end":"Chanmao Inc.", "start":"Client1", "time":10},
//{ "start":"Chanmao Inc.", "end":"Client2", "time":20},
//{ "end":"Chanmao Inc.", "start":"Client2", "time":20},
//{ "start":"Client1", "end":"Client2", "time":25},
//{ "end":"Client1", "start":"Client2", "time":25}
//];

function callbackFunc(str) {
	console.log(str);
}

var d = new Date();
var curTime = d.getTime();
var deliLimit = 10;
console.log(JSON.stringify({"curTime":curTime, "deliLimit":deliLimit, "drivers":drivers, "tasks":tasks, "paths":paths}));
jobSchedule.search(JSON.stringify({"curTime":curTime, "deliLimit":deliLimit, "drivers":drivers, "tasks":tasks, "paths":paths}), callbackFunc);
//console.log(jobSchedule.search(JSON.stringify({"drivers":drivers, "tasks":tasks, "paths":paths})));
