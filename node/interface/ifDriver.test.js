'use strict';

//jshint expr: true
var Q           = require('q');
var chai 		= require('chai');
var sinon 		= require('sinon');
var ifDriver 	= require("./ifDriver");

var mysql       = require('../connection/dbMysql');
var pool        = (new mysql).pool;

chai.should();
var	expect  	= chai.expect();
var driver 		= new ifDriver(pool); 

// describe('ifNode2 test ', function() {
// 	var schedule;
// 	var update_result;
// 	var token;
// 	var secret;
// 	var fake_token;
// 	var new_driver_token;
// 	beforeEach(function() {
// 		schedule =	[ { available: 1437358484276,
// 					       did: '20',
// 					       location: '43.6664587,-79.37461960000002',
// 					       off: 1437364740000,
// 					       tids : [ "0,0,43.6664587,-79.37461960000002,1437363947841", "0,0,43.6664587,-79.37461960000002,1437363990886", "0,0,43.6664587,-79.37461960000002,1437364041253", "43.6664587,-79.37461960000002,43.6642804,-79.37261960000001,1437363947843", "43.6664587,-79.37461960000002,43.7022076,-79.44123739999998,1437364041253", "43.6664587,-79.37461960000002,43.5895049,-79.64793850000001,1437363990886" ],
// 					       updated: 0 },
// 					     { available: 1437358582729,
// 					       did: '24',
// 					       location: '43.6664587,-79.37461960000002',
// 					       off: 1437364740000,
// 					       tids : [ "0,0,43.6664587,-79.37461960000002,1437364095413", "43.6664587,-79.37461960000002,43.7117051,-79.2718888,1437364095413" ],
// 					       updated: 1 } ];
// 		token 				= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';
// 		secret 				= '8';
// 		fake_token 			= '123AiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';
// 		new_driver_token	= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjM2LCJleHBpcmVkIjoiMjAxNS0wOC0xNCAyMTo1Mzo1OCIsImlhdCI6MTQzNzAxMTYzOH0.BhyPJ3teLEGgGc4HdGsoorMy6eT2zKDwS_Ho3UcRBP0';
// 	});
// 	// it('should update driver table',function() {
// 	// 	return driver.action('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjI0LCJleHBpcmVkIjoiMjAxNS0wNy0wNiAxNjowNToyMyIsImlhdCI6MTQzMzYyMTEyM30.Z0Btz-R2ip-GZ4BgcTPN93MOMt1omCJuX_O_gyDB78U', '8','0,0,43.6664587,-79.37461960000002,1437447738793',1)
// 	// 	.then(function(result) {
// 	// 		console.log(result);
// 	// 	})
			
// 	// })
// 	/*

// 	Conditions: 
// 		1.Dirver's token should be valid
// 		2.Dirver's did should be find in redis Driver table
// 		3.Dirver's off_time should later then server's current time
// 	*/
// 	it('should get driver checkin status',function() {
// 		return 	driver.ischeckin(token,secret)
// 				.then(function(result) {
// 					console.log(result);
// 				})
			
// 	})
// 	it('should get driver checkin status fail since token is not correct',function() {
// 		return 	driver.ischeckin(fake_token,secret)
// 				.catch(function(error) {
// 					console.log('error',error);
// 				});
			
// 	})
// 	it('should get driver checkin status fail since driver\'s did can not find in Driver table',function() {
// 		return 	driver.ischeckin(new_driver_token,secret)
// 				.catch(function(error) {
// 					console.log('error',error);
// 				});
			
// 	})

// })

describe('ifNode2 checkin  ', function() {

	/*
	Variables: 
		1.Token: correct token  (username:1002)
		2.Secret: JWT's secret which is 8(string) 
		3.fake_token: Incorrect token
		4.did's type is string
	*/
	var token;
	var secret;
	var fake_token;
	var new_driver_token;
	beforeEach(function() {
		token 				= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';
		secret 				= '8';
		fake_token 			= '123AiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';

	});
	
	/*
	Conditions: 
		1.Dirver's token should be valid
		2.Dirver's did should be retrun by authorize lr_login.authorize
		3.Location is static data due to test purpose 
	*/
	
	it('should checkin success ',function() {
		return 	driver.checkin(token,secret)
				.then(function(eo_result) {
					var result 		= eo_result.result;
					var did    		= eo_result.did;
					var location 	= eo_result.location; 

					chai.expect(result).to.equal(0);
					chai.expect(did).to.equal('33');
/*! Important*/		chai.expect(location).to.equal('43.6664587,-79.37461960000002');
				})
			
	})
	it('should checkin sfail since token is not correct',function() {
		return 	driver.checkin(fake_token,secret)
				.catch(function(error) {
					console.log('error',error);
					var result = error.result
					chai.expect(result).to.equal(1);
				});
			
	})
	it('should checkin success even driver is already check in',function() {
		return 	driver.checkin(token,secret)
				.then(function(eo_result) {
					var result 		= eo_result.result;
					var did    		= eo_result.did;
					var location 	= eo_result.location; 

					chai.expect(result).to.equal(0);
					chai.expect(did).to.equal('33');
/*! Important*/		chai.expect(location).to.equal('43.6664587,-79.37461960000002');
				})
			
	})

})

describe('ifNode2 ischeckin  ', function() {

	/*
	Variables: 
		1.Token: correct token  (username:1002)
		2.Secret: JWT's secret which is 8(string) 
		3.fake_token: Incorrect token
		4.new_driver_token: correct token but did not checkin (username:1005)
	*/
	var token;
	var secret;
	var fake_token;
	var new_driver_token;
	beforeEach(function() {
		token 				= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';
		secret 				= '8';
		fake_token 			= '123AiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';
		new_driver_token	= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjM2LCJleHBpcmVkIjoiMjAxNS0wOC0xNCAyMTo1Mzo1OCIsImlhdCI6MTQzNzAxMTYzOH0.BhyPJ3teLEGgGc4HdGsoorMy6eT2zKDwS_Ho3UcRBP0';
		
		driver.checkin(token,secret).then(function() {

			console.log('ifDriver.test.js driver check in')

		})
	});
	
	/*
	Conditions: 
		1.Dirver's token should be valid
		2.Dirver's did should be find in redis Driver table
		3.Dirver's off_time should later then server's current time
	*/
	
	it('should get driver checkin status',function() {
		return 	driver.ischeckin(token,secret)
				.then(function(eo_result) {
					var result = eo_result.result
					chai.expect(result).to.equal(0);
				})
			
	})
	it('should get driver checkin status fail since token is not correct',function() {
		return 	driver.ischeckin(fake_token,secret)
				.catch(function(error) {
					console.log('error',error);
					var result = error.result
					chai.expect(result).to.equal(1);
				});
			
	})
	it('should get driver checkin status fail since driver\'s did can not find in Driver table',function() {
		return 	driver.ischeckin(new_driver_token,secret)
				.catch(function(error) {
					console.log('error',error);
					var result = error.result
					chai.expect(result).to.equal(1);
				});
			
	})

})
describe('ifNode2 driver check out   ', function() {

	/*
	Variables: 
		1.Token: correct token  (username:1002)
		2.Secret: JWT's secret which is 8(string) 
		3.fake_token: Incorrect token
		4.new_driver_token: correct token but did not checkin (username:1005)
	*/
	var token;
	var secret;
	var fake_token;
	var new_driver_token;
	beforeEach(function() {
		token 				= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';
		secret 				= '8';
		fake_token 			= '123AiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjMzLCJleHBpcmVkIjoiMjAxNS0wOC0yMSAxMjo1MjoyNCIsImlhdCI6MTQzNzU4Mzk0NH0.JgdI6NvVc6Oo8NPs39QwU7eSn_BlPQpQVKDeO9KHNZ4';
		new_driver_token	= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjM2LCJleHBpcmVkIjoiMjAxNS0wOC0xNCAyMTo1Mzo1OCIsImlhdCI6MTQzNzAxMTYzOH0.BhyPJ3teLEGgGc4HdGsoorMy6eT2zKDwS_Ho3UcRBP0';
		

	});
	
	/*
	Conditions: 
		1.Dirver's token should be valid
		2.Dirver's did should be find in redis Driver table
		3.Dirver's off_time should later then server's current time
	*/
	
	it('should chekout driver 33',function() {

			return 	driver.checkout(token,secret)
					.then(function(eo_result) {
						console.log('should chekout driver 33',eo_result)
						var result = eo_result.result
						chai.expect(result).to.equal(0);
					})
					.catch(function(eo_error) {
						console.log(eo_error)
					})
		

			
	})
	it('should get driver checkin status fail since driver33\'s did can not find in Driver table',function() {
		setTimeout(function() {
			return 	driver.ischeckin(token,secret)
					.then(function(eo_result) {
						chai.expect(eo_result).to.equal(null);
					})
					.catch(function(error) {
						console.log('error',error);
						var result = error.result
						chai.expect(result).to.equal(1);
					});
		}, 200);
		

			
	})
	it('should get driver checkin status fail since token is not correct',function() {
		setTimeout(function() {
			return 	driver.checkout(fake_token,secret)
					.catch(function(eo_result) {
						console.log('error',eo_result);
						var result = eo_result.result
						chai.expect(result).to.equal(1);
					});
		}, 200);
		
			
	})

})
