function Status(ir_pool) { 
    
	this.create = function(iv_type, iv_desc) { 
		var lv_type = iv_type;
        var lv_desc = iv_desc;
        
        var sql_insert_status = "INSERT INTO status SET ?"; 
        var parameter_insert_status = {};
        parameter_insert_status.type = lv_type;
        parameter_insert_status.desc = lv_desc;
        
        ir_pool.queryAsync(sql_insert_status, parameter_insert_statuss).spread( function (result) {
//            console.log(users[0].username);
        }).catch(function(e) {
            console.log("Exception " + e);
        });
    }; 
    
	this.change = function(iv_id, iv_type, iv_value) { 
		var lv_id = iv_id;
        var lv_type = iv_type;
        var lv_value = iv_value;

        var sql_select_status = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var parameter_select_status = ['status', 'id', iv_id];
        
        ir_pool.queryAsync(sql_select_status, parameter_select_status).spread( function (rows, columns) {
            if (rows[0] != null) {
                var sql_update_status = "UPDATE status SET ? WHERE ?? = ?";
                var value_update_status = { };     
                if (iv_type != null) value_update_status.type = lv_type;
                if (iv_value != null) value_update_status.value = lv_value;
                
                var parameter_update_status  = [value_update_status, 'type', iv_type, ];
                
                ir_pool.queryAsync(sql_update_status, parameter_update_status).spread( function (result) {
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

module.exports = Status;
