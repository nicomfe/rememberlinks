'use strict';

describe('Controller: MyLinksCtrl', function () {

  // load the controller's module
  beforeEach(module('rememberLinksApp'));

  var MyLinksCtrl, scope, succeedPromise, http;

  var LinkServiceSpy, AuthSpy;
  var $controller;
  var failResponseMock = { "status": 400};

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, $rootScope, $q, Auth, $http, LinkService) {
    scope = $rootScope.$new();
    http= $http;
    $controller = _$controller_;
    LinkServiceSpy = LinkService;
    AuthSpy = Auth;
    spyOn(AuthSpy, 'getCurrentUser').andCallFake(function() {
      var mockUser = {};
      var defer = $q.defer();
      mockUser.$promise = defer.promise;
      defer.resolve({_id:'12133'});
      return mockUser;
    });

    spyOn(LinkServiceSpy, "getByUser")
      .andCallFake(function(){
        if (succeedPromise) {
          var successResponseMock = {
            data: [
              {
                _id:'111',
                url:'http://www.mock.com',
                info:'mockInfo',
                date: new Date(),
                tags: ['mock']
              }
            ]
          };
          return  {
            then: function(callback) {return callback(successResponseMock);}
          };;
        }
        else{
          return $q.when(failResponseMock);
        }
    });

    MyLinksCtrl = $controller('MyLinksCtrl', {
      $scope: scope,
      $http: http
    });
  }));

  it('check scope variable for all links', function () {
    succeedPromise = true;
    var results = scope.getAllLinks();
    expect(scope.links.length).toBe(1);
  });
});
