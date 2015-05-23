function Driver(ir_pool) { 
    
	this.create = function(iv_driver, iv_ffurl) { 
		var lv_driver = iv_driver;
        var lv_ffurl = iv_ffurl;
        
        var sql_insert_driver = "INSERT INTO driver SET ?"; 
        var parameter_insert_driver = {};
        parameter_insert_driver.driver = lv_driver;
        parameter_insert_driver.ffurl = lv_ffurl;   
        
        ir_pool.queryAsync(sql_insert_driver, parameter_insert_driver).spread( function (result) {
//            console.log(users[0].username);
        }).catch(function(e) {
            console.log("Exception " + e);
        });
    }; 
    
	this.change = function(iv_driver, iv_ffurl) { 
		var lv_driver = iv_driver;
        var lv_ffurl = iv_ffurl;
        
        var sql_select_driver = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var parameter_select_driver = ['driver', 'driver', lv_driver];
 
        ir_pool.queryAsync(sql_select_driver, parameter_select_driver).spread( function (rows, columns) {
            if (rows[0] != null) {
                var sql_update_driver = "UPDATE user SET ? WHERE ?? = ? ";
                var value_update_driver = { };     
                if (lv_ffurl != null) value_update_driver.ffurl = lv_ffurl;
                ir_pool.queryAsync(sql_update_driver, parameter_update_driver).spread( function (result) {
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

module.exports = Driver;
