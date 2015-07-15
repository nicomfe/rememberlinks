'use strict';

describe('Controller: MyLinksCtrl', function () {

  // load the controller's module
  beforeEach(module('rememberLinksApp'));

  var MyLinksCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyLinksCtrl = $controller('MyLinksCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
