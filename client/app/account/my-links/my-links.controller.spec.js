'use strict';

describe('Controller: MyLinksCtrl', function () {

  // load the controller's module
  beforeEach(module('rememberLinksApp'));

  var MyLinksCtrl, scope, http, messsages, _q;
  var currentUserPromise, getByUserPromise, getByTagsPromise;
  var LinkServiceSpy, AuthSpy;
  var $controller;
  var failResponseMock = { "status": 400};

  var expectedLinkByUser = {
    _id:'111',
    url:'http://www.mock.com',
    info:'mockInfo',
    date: new Date(),
    tags: ['mock']
  };

  var expectedLinkWhenFilteringByTag = {
    _id:'111',
    url:'http://www.mock.com',
    info:'mockInfo',
    date: new Date(),
    tags: ['mockTag1','mockTag2']
  };

  var expectedLoggedInUser = {
    _id:'12133'
  }

  function mockPromise(isSuccess, resolveData, rejectData){
    var defer = _q.defer();
    if(isSuccess){
      defer.resolve(resolveData);
    }else{
      defer.reject(rejectData);
    }
    return defer.promise;
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, $rootScope, $q, Auth, $http, LinkService, messages) {
    _q = $q;
    scope = $rootScope.$new();
    http= $http;
    $controller = _$controller_;
    LinkServiceSpy = LinkService;
    messsages = messages;
    AuthSpy = Auth;
    getByUserPromise = true;
    currentUserPromise = true;
    getByTagsPromise = true;

    spyOn(AuthSpy, 'getCurrentUser').andCallFake(function() {
      var mockUser = {};
      mockUser.$promise = mockPromise(currentUserPromise,expectedLoggedInUser,'');
      return mockUser;
    });

    spyOn(LinkServiceSpy, "getByUser").andCallFake(function(){
        var successResponseMock = [expectedLinkByUser];
        return mockPromise(getByUserPromise,successResponseMock,'');
    });

    spyOn(LinkServiceSpy, "getByTags")
      .andCallFake(function(){
        var succesGetByTagsResponse = [expectedLinkWhenFilteringByTag];
        return mockPromise(getByTagsPromise,succesGetByTagsResponse,'');
    });

    spyOn(LinkServiceSpy, "removeById")
      .andCallFake(function(){
        return  {
          then: function(callback) {return callback(true);}
        };
    });

    spyOn(LinkServiceSpy, "update")
      .andCallFake(function(){
        return  {
          then: function(callback) {return callback(true);}
        };
    });

    MyLinksCtrl = $controller('MyLinksCtrl', {
      $scope: scope,
      $http: http
    });
  }));

  it('Authorization method should be called when scope.init is called', function () {
    scope.init();
    scope.$apply();
    expect(AuthSpy.getCurrentUser).toHaveBeenCalled();
  });

  it('should save in the scope an error message when an error is thrown trying to get current user', function () {
    currentUserPromise = false;
    scope.init();
    scope.$apply();
    expect(AuthSpy.getCurrentUser).toHaveBeenCalled();
    expect(scope.errorMessage).toBe(messsages.UNEXPECTED_ERROR);

  });

  it('logged in user should be added to scope', function() {
    scope.init();
    scope.$apply();
    expect(scope.currentUser).not.toBe(undefined);
    expect(scope.currentUser._id).toBe(expectedLoggedInUser._id);
  });

  it('should call get links by user mechanism', function () {
    scope.init();
    scope.$apply();
    expect(LinkServiceSpy.getByUser).toHaveBeenCalled();
  });

  it('should add to scope all links of logged in user', function(){
    scope.init();
    scope.$apply();
    expect(scope.links).not.toBe(undefined);
    expect(scope.links.length).toBe(1);
    expect(scope.links[0]).toBe(expectedLinkByUser);
  });

  it('should be able to get links filtering by tags and adding results to the scope', function(){
    scope.searchFilterTags = 'mockTag1 mockTag2';
    scope.$apply(); // initialize controller get all will be called
    scope.getLinksByTags();
    scope.$apply();
    expect(LinkServiceSpy.getByTags).toHaveBeenCalledWith(scope.searchFilterTags);
    expect(scope.links).not.toBe(undefined);
    expect(scope.links.length).toBe(1);
    expect(scope.links[0]).toBe(expectedLinkWhenFilteringByTag);
  });

  it('should return all links when filtering by empty array of tags, calling get all links instead of filtering by empty', function(){
    scope.searchFilterTags = '';
    scope.getLinksByTags();
    scope.$apply();
    expect(LinkServiceSpy.getByTags).not.toHaveBeenCalled();
    expect(LinkServiceSpy.getByUser).toHaveBeenCalled();
    expect(scope.links).not.toBe(undefined);
    expect(scope.links.length).toBe(1);
    expect(scope.links[0]).toBe(expectedLinkByUser);
  });

  it('should remove link by id calling right service', function(){
    // have 2 links in the scope
    var mockLinkToBeDeleted = {_id:'mockLinkToBeDeleted', url:'firstURL'};
    var mockLinkToBeKept = {_id:'mockLinkToBeKept', url:'secondURL'};
    scope.$apply();
    scope.links = [mockLinkToBeDeleted,mockLinkToBeKept];
    // remove one of them
    scope.removeLinkById(mockLinkToBeDeleted._id);
    scope.$apply();
    expect(LinkServiceSpy.removeById).toHaveBeenCalledWith(mockLinkToBeDeleted._id);
    expect(scope.links).not.toBe(undefined);
    expect(scope.links.length).toBe(1);
    expect(scope.links[0]).toBe(mockLinkToBeKept);
  });

  it('should enable edit link when calling editLink adding its id to the scope', function(){
    var mockLinkToBeUpdated = {_id:'mockLinkToBeUpdated', url:'firstURL'};
    scope.editLink(mockLinkToBeUpdated);
    scope.$apply();
    expect(scope.linkToUpdate).toBe(mockLinkToBeUpdated);
    expect(scope.displayEditId).toBe(mockLinkToBeUpdated._id);
  });

  it('should update link by calling right service and removing id from the scope', function(){
    var mockLinkToBeUpdated = {_id:'mockLinkToBeUpdated', url:'firstURL'};
    scope.displayEditId = mockLinkToBeUpdated._id;
    scope.updateLink(mockLinkToBeUpdated);
    scope.$apply();
    expect(scope.displayEditId).toBe('');
  });
});
