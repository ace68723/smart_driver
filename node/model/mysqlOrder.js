var moment = require('moment');
var Promise = require('bluebird');
var modelAddress = require("./../model/mysqlAddress");
var modelRr = require("./../model/mysqlRr");

function Order(ir_pool) { 
    
	this.create = function(iv_uid, iv_aid, iv_price, iv_paytype, iv_charge, iv_area, iv_status, iv_tips, iv_ready) { 
        return new Promise(function (resolve, reject) {
            var lv_uid = iv_uid;
            var lv_aid = iv_aid;
            var lv_price = iv_price;
            var lv_paytype = iv_paytype; 
            var lv_charge = iv_charge;
            var lv_tips = iv_tips; 
            var lv_ready = iv_ready;
            var lv_area = 0;     
            var lv_status = 0;  
            var lv_created = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");


            var sql_insert_order = "INSERT INTO orders SET ?"; 
            var value_insert_order = {};
            value_insert_order.uid = lv_uid;
            value_insert_order.aid = lv_aid;   
            value_insert_order.price = lv_price;
            value_insert_order.paytype = lv_paytype; 
            value_insert_order.charge = lv_charge;
            value_insert_order.area = lv_area;         
            value_insert_order.status = lv_status;    
            value_insert_order.created = lv_created;   
            value_insert_order.tips = lv_tips;    
            value_insert_order.ready = lv_ready; 
            var parameter_insert_order = [ value_insert_order ];
                    
            ir_pool.queryAsync(sql_insert_order, parameter_insert_order).spread( function (result) {
    //            console.log(users[0].username);   
                
                resolve([{'oid': result.insertId} ]);
            }).catch(function(e) {
//                console.log("Exception " + e);
                reject(e);
            });
        });
    }; 
    
    this.findOne = function( iv_oid ) {
        return new Promise(function (resolve, reject) {
            var sql_select_order = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
            var parameter_select_order = ['orders', 'order', iv_oid];
            ir_pool.queryAsync(sql_select_order, parameter_select_order).spread( function (rows, columns) {
                if (rows[0] != null) {
                    resolve( rows[0] );
                }
            }).catch(function(e) {
                reject(e);
            }); 
        });
    };

    
    this.findStartEnd = function( iv_oid ) {
        return new Promise(function (resolve, reject) {
            
            this.findOne( iv_oid ).then( function(lo_order) {
                    var lm_address = new modelAddress(ir_pool);
                    lm_address.findOne( lo_order.aid ).then( function(order_address_result) {
                        var lm_rr = new modelRr(ir_pool);
                        lm_rr.getLatLng( lo_order.uid ).then( function(rr_address_result) {
                            
                            resolve({ start_lat:rr_address_result.lat , end_lat: rr_address_result.lng, 
                                        start_lat: order_address_result.lat, end_lng: order_address_result.lng,
                                            ready: lo_order.ready});
                        }).catch( function(e) {
                            reject(e);
                        });
                    }).catch( function(e) {
                        reject(e);
                    });
                    
            }).catch(function(e) {
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
        var parameter_select_order = ['orders', 'order', lv_oid];
 
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
