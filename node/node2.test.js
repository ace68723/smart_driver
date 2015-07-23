'use strict';

//jshint expr: true

var chai 	= require('chai');
var sinon 	= require('sinon');
var node2 = require("./node2");

var	expect  = chai.expect();

chai.should();

describe('getTable', function() {
	
	it('should get driver',function() {
		return node2.getTables().then(function(result) {
			console.log(result);
		})
			
	})
})