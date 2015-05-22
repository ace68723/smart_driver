'use strict';

describe('Controller: PlaceOrderCtrl', function () {

  // load the controller's module
  beforeEach(module('smartApp'));

  var PlaceOrderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaceOrderCtrl = $controller('PlaceOrderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
