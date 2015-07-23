'use strict';

//jshint expr: true

var chai 	= require('chai');
var sinon 	= require('sinon');

var	expect  = chai.expect();

chai.should();

describe('sinon test',function() {
	var student;

	beforeEach(function() {
		student = {
			dropClass: function(clasID, cb) {
				//do stuff
				
				cb();
			}
		};

		schedule = {
			dropClass: function() {
				console.log('class dropped');
			}
		}
	});

	describe('student dropClass',function() {
		it('should call the callback',function() {
			// var called = false;

			// function callback() {
			// 	called = true;
			// };

			var spy = sinon.spy();
			student.dropClass(1,spy);
			spy.called.should.be.true;
		});

		it('should call the call back and log',function() {
			function onClassDropped	() {
				console.log('onClassDropped was called')
			};

			var spy = sinon.spy(onClassDropped);
			student.dropClass(1,spy);
			spy.called.should.be.true
		})







	});
});