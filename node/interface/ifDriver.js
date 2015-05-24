var modelUser = require("./../model/mysqlUser");
var Promise = require("bluebird");
var ifLogin = require("./../interface/ifLogin");
var ifNode2 = require("./../interface/ifNode2");

function Driver(ir_pool) { 


    this.action = function(iv_token, iv_secret, iv_tid, iv_action) {
        return new Promise(function (resolve, reject) {
               var lr_login = new ifLogin;
               var node2 = new ifNode2;
               var eo_result = { };

               lr_login.authorize(iv_token, iv_secret).then( function(auth_result) {
                   
                     if (iv_action == 1) {
                         
                        var eo_result = { };
                        var la_del_key = [ iv_tid ]; 
                        node2.delItem( 'Task', la_del_key ).then( function (order_result){
                            eo_result.result = 0;
                            reject(eo_result);

                        }).catch(function(e) {
                            eo_result.result = 1;
                            eo_result.message = e;
                            reject(eo_result);
                        });

                  } else { 
                     eo_result.result = 1;
                     eo_result.message = auth_result;
                     reject(eo_result);
                  }
               }).catch(function(e) {
                    eo_result.result = 1;
                    eo_result.message = e;
                    reject(eo_result);
               });
            });
    }
    
	
}; 

module.exports = Driver;
