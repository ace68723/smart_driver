var mysql = require('mysql');
var Promise = require ('bluebird');

function Mysql() { 
    
    Promise.promisifyAll(require("mysql/lib/Pool").prototype);
    Promise.promisifyAll(require("mysql/lib/Connection").prototype);
    
    // this.pool = mysql.createPool({
    //       connectionLimit : 30,
    //       host            : 'localhost',
    //       user            : 'root',
    //       password        : '',
    //       database        : 'node'    
    // });  

   // this.pool = mysql.createPool({
   //       connectionLimit : 30,
   //       host            : 'localhost',
   //       user            : 'root',
   //       password        : 'MySmartSQL',
   //       database        : 'node'    
   // });     
   this.pool = mysql.createPool({
         connectionLimit : 30,
         host            : '45.33.95.211',
         user            : 'root',
         password        : 'MySmartSQL',
         database        : 'node'    
   });    
};

module.exports = Mysql;