function Track(ir_pool) { 
    
	this.create = function(iv_lat, iv_lng, iv_addr, iv_city, iv_unit, iv_postal, iv_tel, iv_name, iv_comment) { 
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
        
        var sql_insert_address = "INSERT INTO addr SET ?"; 
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
            console.log(users[0].username);
        }).catch(function(e) {
            console.log("Exception " + e);
        });
    }; 
    
	
}; 

module.exports = Track;
