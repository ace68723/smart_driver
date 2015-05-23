function Area(ir_pool) { 
    
	this.create = function(iv_area, iv_ffurl) { 
		var lv_area = iv_area;
        var lv_ffurl = iv_ffurl;
        
        var sql_insert_area = "INSERT INTO area SET ?"; 
        var parameter_insert_area = {};
        parameter_insert_area.area = lv_area;
        parameter_insert_area.ffurl = lv_ffurl;   
        
        ir_pool.queryAsync(sql_insert_area, parameter_insert_area).spread( function (result) {
//            console.log(users[0].username);
        }).catch(function(e) {
            console.log("Exception " + e);
        });
    }; 
    
	this.change = function(iv_area, iv_ffurl) { 
		var lv_area = iv_area;
        var lv_ffurl = iv_ffurl;
        
        var sql_select_area = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var parameter_select_area = ['area', 'area', lv_area];
        ir_pool.queryAsync(sql_select_area, parameter_select_area).spread( function (rows, columns) {
            if (rows[0] != null) {
                var sql_update_area = "UPDATE area SET ? WHERE ?? = ? ";
                var value_update_area = { };     
                if (lv_ffurl != null) value_update_area.ffurl = lv_ffurl;
                var parameter_update_area = [value_update_area , 'area', lv_area]; 
                
                ir_pool.queryAsync(sql_update_area, parameter_update_area).spread( function (result) {
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

module.exports = Area;
