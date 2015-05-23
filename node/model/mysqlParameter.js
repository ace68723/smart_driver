
var Promise = require('bluebird');
function Parameter(ir_pool) { 
    
    
	this.create = function(iv_id, iv_value) { 
		var lv_id = iv_id;
        var lv_value = iv_value;
   
        var sql_insert_parameter = "INSERT INTO parameter SET ?"; 
        var parameter_insert_parameter = {};
        
        parameter_insert_parameter.id = lv_id;
        parameter_insert_parameter.value = lv_value;      
        
        ir_pool.queryAsync(sql_insert_parameter, parameter_insert_parameter).spread( function (result) {
            console.log(result);
        }).catch(function(e) {
            console.log("Exception " + e);
        });
    }; 
    
	this.findOne = function(iv_id) { 
        return new Promise(function (resolve, reject) {
           
            var lv_id = iv_id;
            var sql_select_parameter = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
            var parameter_select_parameter = ['parameter', 'id', lv_id];
            ir_pool.queryAsync(sql_select_parameter, parameter_select_parameter).spread( function (row) {
                 if (row[0].value != null) {
                    resolve(row[0].value);
                } else { 
                    reject('No Accounts');
                }

            }).catch(function(e) {
    //            console.log("Exception " + e);
                console.log("e");
                throw e;
            });

        });
		
    }; 
    
	this.change = function(iv_id,  iv_value) { 
		var lv_id = iv_id;
        var lv_value = iv_value;

        var sql_select_parameter = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var parameter_select_parameter = ['parameter', 'id', lv_id];
        
        ir_pool.queryAsync(sql_select_parameter, parameter_select_parameter).spread( function (rows, columns) {
            if (rows[0] != null) {
                var sql_update_parameter = "UPDATE paramter SET ? WHERE ?? = ? ";
                var value_update_parameter = { };     
                if (lv_value != null) value_update_parameter.value = lv_value;
                var parameter_update_parameter  = [value_update_parameter, 'id', lv_id];
                
                ir_pool.queryAsync(sql_update_parameter, parameter_update_parameter).spread( function (result) {
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

module.exports = Parameter;
