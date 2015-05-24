var jwt = require('jsonwebtoken');
var modelUser = require("../model/mysqlUser");
var modelParameter = require("../model/mysqlParameter");
var Promise = require('bluebird');


function Login(ir_pool) { 
       
	this.login = function(iv_username, iv_password, iv_secret) { 
       return new Promise(function (resolve, reject) {
           var eo_result = { };
           var lv_username = iv_username;
           var lv_password = iv_password;
           var lv_secret = iv_secret;
           var user = new modelUser(ir_pool);
           
           user.login(iv_username, iv_password, iv_secret).then( function (result){
               eo_result.result = 0;
               eo_result.token = result.token;
               eo_result.type = result.type;
               eo_result.lat = result.lat;
               eo_result.lng = result.lng;
               resolve (eo_result);   
           }).catch(function(e) {
//               eo_result.result = 1;
//               eo_result.message = e;
               reject(e);
           });
       });
    };

    this.authorize = function(iv_token, iv_secret) { 
        
        return new Promise(function (resolve, reject) {
            var eo_result = { };
            
            jwt.verify(iv_token, iv_secret, function(err, decoded) {
                
                if (err) {
                    eo_result.result = 1;
                    eo_result.message = err;
                    reject(eo_result); 
                } else {
                    var user = new modelUser(ir_pool);
                    user.authorize(decoded.uid, iv_token).then( function (result){
                        
                        eo_result.result = 0;
                        resolve(eo_result);  
                    }).catch(function(e) {
                        
                        eo_result.result = 1;
                        eo_result.message = e;
                        reject(eo_result);

                    });
                }
            });  
        });      
    }
    
    this.getSecret = function( ) {
        return new Promise(function (resolve, reject) {
            var parameter = new modelParameter(ir_pool);
            var eo_result = { };
            parameter.findOne( 'SYS_SECRET').then( function (result){
                eo_result.result = 0;
                eo_result.secret = result;
                resolve(eo_result);
            }).catch(function(e) {
                eo_result.result = 1;
                eo_result.message = e;
                reject(eo_result);
            });
        });
    }
    
	
}; 

module.exports = Login;
