var moment = require('moment');
var Promise = require('bluebird');
function Order(ir_pool) { 
    
	this.create = function(iv_uid, iv_aid, iv_price, iv_paytype, iv_charge, iv_area, iv_status) { 
        return new Promise(function (resolve, reject) {
            var lv_uid = iv_uid;
            var lv_aid = iv_aid;
            var lv_price = iv_price;
            var lv_paytype = iv_paytype; 
            var lv_charge = iv_charge;
            var lv_area = 0;     
            var lv_status = 0;  
            var lv_created = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");


            var sql_insert_order = "INSERT INTO order SET ?"; 
            var parameter_insert_order = {};
            parameter_insert_order.uid = lv_uid;
            parameter_insert_order.aid = lv_aid;   
            parameter_insert_order.price = lv_price;
            parameter_insert_order.paytype = lv_paytype; 
            parameter_insert_order.charge = lv_charge;
            parameter_insert_order.area = lv_area;         
            parameter_insert_order.status = lv_status;    
            parameter_insert_order.created = lv_created;   

            ir_pool.queryAsync(sql_insert_order, parameter_insert_order).spread( function (result) {
    //            console.log(users[0].username);   
                
                resolve([{'result': result.insertId} ]);
            }).catch(function(e) {
//                console.log("Exception " + e);
                reject(e);
            });
        });
    }; 
    
	this.change = function(iv_oid, iv_uid, iv_aid, iv_price, iv_paytype, iv_charge, iv_area, iv_status) { 
		var lv_oid = iv_oid;
        var lv_uid = iv_uid;
        var lv_aid = iv_aid;
		var lv_price = iv_price;
        var lv_paytype = iv_paytype; 
		var lv_charge = iv_charge;
        var lv_area = iv_area;     
        var lv_status = iv_status;           
        var sql_select_order = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var parameter_select_order = ['order', 'order', lv_oid];
 
        ir_pool.queryAsync(sql_select_order, parameter_select_order).spread( function (rows, columns) {
            if (rows[0] != null) {
                var sql_update_order = "UPDATE user SET ? WHERE ?? = ? ";
                var value_update_order = { };     
                if (lv_aid != null) value_update_order.aid = lv_aid;
                if (lv_price != null) value_update_order.price = lv_price;
                if (lv_paytype != null) value_update_order.paytype = lv_paytype;
                if (lv_charge != null) value_update_order.charge = lv_charge;
                if (lv_area != null) value_update_order.area = lv_area;
                if (lv_status != null) value_update_order.status = lv_status;
                var parameter_update_order = [value_update_order, 'oid', lv_oid];
                
                ir_pool.queryAsync(sql_update_order, parameter_update_order).spread( function (result) {
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

module.exports = Order;
