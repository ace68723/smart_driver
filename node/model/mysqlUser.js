var Promise         = require("bluebird");
var moment = require('moment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt'); 
var lv_extension = 30;

function User(ir_pool) { 
       
	this.create = function(iv_username, iv_password, iv_email, iv_name, iv_type, iv_secret) { 
		var lv_username = iv_username;
        var lv_email = iv_email;
        var lv_name = iv_name;
        var lv_type = iv_type;
        var lv_status = 0;
        var lv_secret = iv_secret;
        var lv_date = new Date(); 
        var lv_created = moment(lv_date).format("YYYY-MM-DD HH:mm:ss");
        var salt = bcrypt.genSaltSync( Number( moment(lv_date).format("S") ));
        var lv_password = bcrypt.hashSync(iv_password, salt);

        var sql_insert_user = "INSERT INTO user SET ?";
        var value_insert_user = { };   
        value_insert_user.username = lv_username;
        value_insert_user.password = lv_password;
        value_insert_user.email = lv_email;
        value_insert_user.name = lv_name;
        value_insert_user.type = lv_type;
        value_insert_user.status = lv_status;
        value_insert_user.created = lv_created;
        var parameter_insert_user = [ value_insert_user ];
        
        ir_pool.queryAsync(sql_insert_user, parameter_insert_user).spread( function (rows) {
                    console.log( rows );
                    console.log( rows.affectedRows );
                    if (rows.affectedRows != 0) {
                        var lv_expired = moment(lv_date).add(lv_extension, 'days').format("YYYY-MM-DD HH:mm:ss");
                        var lv_token = jwt.sign( { uid: rows.insertId, expired : lv_expired }, lv_secret);
                        
                        var sql_update_user = "UPDATE user SET ? WHERE ?? = ? ";
                        var value_update_user = { };     
                        value_update_user.token = lv_token;
                        value_update_user.expired = lv_expired;
                        var parameter_update_user = [ value_update_user, 'uid' , rows.insertId ];
                        ir_pool.queryAsync(sql_update_user, parameter_update_user).spread( function (result) {
                            console.log('changed ' + result.changedRows + ' rows');   
                        }).catch(function(e) {
                            console.log("Exception " + e);
                        }); 
                    }
                }).catch(function(e) {
                    console.log("Exception " + e);
         });
    }; 

    this.login = function(iv_username, iv_password, iv_secret) {
        return new Promise(function (resolve, reject) {
            var lv_secret = iv_secret;
            var lv_username = iv_username;
            var lv_password = iv_password;

            var sql_fetch_user = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
            var parameter_fetch_user = ['user', 'username', lv_username];
            
            ir_pool.queryAsync(sql_fetch_user, parameter_fetch_user).spread( function (rows, columns) {
               console.log(rows);
                if (rows[0] != null) {
                    bcrypt.compare(lv_password, rows[0].password , function(err, isMatch) {

                        if(err) {
                            reject('Error');
                        } else if (isMatch == false ) {
                            var result ={'result': 1, 'message' : 'Incorrect password' };
                            reject( result );
                        } else if (isMatch == true ) {
                            var lv_expired = moment(new Date()).add(lv_extension, 'days').format("YYYY-MM-DD HH:mm:ss");
                            var lv_token = jwt.sign( { uid : rows[0].uid, expired : lv_expired }, lv_secret);

                            var sql_update_user = "UPDATE user SET ? WHERE ?? = ? ";
                            var value_update_user = { };     
                            value_update_user.token = lv_token;
                            value_update_user.expired = lv_expired;
                            var parameter_update_user = [ value_update_user, 'uid' , rows[0].uid ];

                            ir_pool.queryAsync(sql_update_user, parameter_update_user).spread( function (result) {
                                resolve( {'token': lv_token, 'type': rows[0].type  }); 
                            }).catch(function(e) {
                                reject(e);
                            });     
                        }

                   }); 

                } else {
                    reject( {'result': 1, 'message': 'User or Password incorrect' });
                }
            }).catch(function(e) {
                reject(e);
            });
        });
        
    }
    

    this.authorize = function(iv_uid, iv_token){
        return new Promise(function (resolve, reject) {
            var lv_uid = iv_uid;
            var sql_fetch_user = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
            var parameter_fetch_user = ['user', 'uid', lv_uid];

            ir_pool.queryAsync(sql_fetch_user, parameter_fetch_user).spread( function (rows, columns) {
        
                var lv_expired = rows[0].expired;
                var lv_date = new Date();
                if (lv_expired >= lv_date) {
                    resolve(0);
                } else {
                    reject('Token expired');
                }
            }).catch(function(e) {
    //            console.log("Exception " + e);
                reject(e);
            });
        });
         
    }
    
// ************************
    this.change = function(iv_uid, iv_username, iv_password, iv_email, iv_name, iv_status) { 
		var lv_uid = iv_uid;
        var lv_username = iv_username;
        var lv_password = iv_password;
        var lv_email = iv_email;
        var lv_name = iv_name;
        var lv_status = iv_status;
        
        var sql_fetch_user = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var parameter_fetch_user = ['user', 'uid', lv_uid];
        
        ir_pool.queryAsync(sql_fetch_user, parameter_fetch_user).spread( function (rows, columns) {
            if (rows[0] != null) {
                var sql_update_user = "UPDATE user SET ? WHERE ?? = ? ";
                var value_update_user = { };     
                if (lv_username != null) value_update_user.username = lv_username;
                if (lv_password != null) value_update_user.password = lv_password;
                if (lv_email != null) value_update_user.email = lv_email;
                if (lv_name != null) value_update_user.name = lv_name;
                if (lv_status != null) value_update_user.status = lv_status;
                var parameter_update_user = [ value_update_user, 'uid' , lv_uid];
                ir_pool.queryAsync(sql_update_user, parameter_update_user).spread( function (result) {
                    console.log('changed ' + result.changedRows + ' rows');   
                }).catch(function(e) {
                    console.log("Exception " + e);
                }); 
            }
        }).catch(function(e) {
            console.log("Exception " + e);
        });

	}; 
    
 

    
}; 

 
module.exports = User;

