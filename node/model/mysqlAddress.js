var moment = require('moment');
var Promise = require('bluebird');
function Address(ir_pool) { 
    
	this.create = function(iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_comment) { 
        return new Promise(function (resolve, reject) {
            var lv_lat = iv_lat;
            var lv_lng = iv_lng;
            var lv_addr = iv_addr;
            var lv_city = iv_city;
            var lv_unit = iv_unit;
            var lv_postal = iv_postal;        
            var lv_tel = iv_tel;
            var lv_comment = iv_comment;
            var lv_name = iv_name;
            var lv_status = 0;
            var lv_created = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

            var sql_insert_address = "INSERT INTO address SET ?"; 
            var parameter_insert_address = {};
            parameter_insert_address.lat = lv_lat;
            parameter_insert_address.lng = lv_lng;
            parameter_insert_address.addr = lv_addr;
            parameter_insert_address.city = lv_city;
            parameter_insert_address.unit = lv_unit;
            parameter_insert_address.postal = lv_postal;        
            parameter_insert_address.tel = lv_tel;
            parameter_insert_address.comment = lv_comment;
            parameter_insert_address.name = lv_name;
            parameter_insert_address.status = lv_status;
            parameter_insert_address.created = lv_created;      

            ir_pool.queryAsync(sql_insert_address, parameter_insert_address).spread( function (result) {
//                console.log(users[0].username);
              
                resolve([{'result': result.insertId }]);
            }).catch(function(e) {
//                console.log("Exception " + e);
                reject(e);
            });
        });
    }; 
    

	this.change = function(iv_aid, iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_status, iv_comment) { 
        return new Promise(function (resolve, reject) {
            var lv_aid = iv_aid;
            var lv_lat = iv_lat;
            var lv_lng = iv_lng;
            var lv_addr = iv_addr;
            var lv_city = iv_city;
            var lv_unit = iv_unit;
            var lv_postal = iv_postal;        
            var lv_tel = iv_tel;
            var lv_comment = iv_comment;
            var lv_name = iv_name;
            var lv_status = 0;   

            var sql_select_address = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
            var parameter_select_address = ['address', 'aid', lv_aid];
            ir_pool.queryAsync(sql_select_address, parameter_select_address).spread( function (rows, columns) {
                if (rows[0] != null) {
                    var sql_update_address = "UPDATE area SET ? WHERE ?? = ? ";
                    var value_update_address = { };     
                    if (lv_lat != null) value_update_address.lat = lv_lat;
                    if (lv_lng != null) value_update_address.lng = lv_lng;
                    if (lv_addr != null) value_update_address.addr = lv_addr;
                    if (lv_city != null) value_update_address.city = lv_city;
                    if (lv_unit != null) value_update_address.unit = lv_unit;
                    if (lv_postal != null) value_update_address.postal = lv_postal;
                    if (lv_tel != null) value_update_address.tel = lv_tel;
                    if (lv_comment != null) value_update_address.comment = lv_comment;
                    if (lv_name != null) value_update_address.name = lv_name;
                    if (lv_status != null) value_update_address.status = lv_status;

                    var parameter_update_address = [value_update_address , 'aid', lv_aid]; 

                    ir_pool.queryAsync(sql_update_address, parameter_update_address).spread( function (result) {
//                        console.log('changed ' + result.changedRows + ' rows');  
                        resolve([{'result': users[0].username }]);
                    }).catch(function(e) {
//                        console.log("Exception " + e);
                        reject("exception");
                    }); 
                }
            }).catch(function(e) {
//                console.log("Exception " + e);
                reject("exception");
            });
        })
    };     
    
}; 

module.exports = Address;
