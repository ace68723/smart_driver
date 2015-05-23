var mysql = require('mysql');
var Promise = require ('bluebird');

function Mysql() { 
    
    Promise.promisifyAll(require("mysql/lib/Pool").prototype);
    Promise.promisifyAll(require("mysql/lib/Connection").prototype);
    
//    this.pool = mysql.createPool({
//          connectionLimit : 30,
//          host            : 'localhost',
//          user            : 'root',
//          password        : '',
//          database        : 'node'    
//    });  

    this.pool = mysql.createPool({
          connectionLimit : 30,
          host            : 'ajaxmart.ca:3306',
          user            : 'root',
          password        : 'MySmartSQL',
          database        : 'node'    
    });      
};

module.exports = Mysql;