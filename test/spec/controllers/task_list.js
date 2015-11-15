'use strict';

describe('Controller: TaskListCtrl', function () {

  // load the controller's module
  beforeEach(module('smartDriverApp'));

  var TaskListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaskListCtrl = $controller('TaskListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
