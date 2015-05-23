var redis = require("redis");
var Promise = require ('bluebird');

function Redis( ) { 
    
    Promise.promisifyAll(redis);
    client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
    });    
    
    this.client = client;      
};

module.exports = Redis;