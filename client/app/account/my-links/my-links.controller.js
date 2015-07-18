'use strict';

RememberLinksApp.controller('MyLinksCtrl', function ($scope, Auth, $http) {
    $scope.addLink = function() {
      $scope.newLink.userId = $scope.currentUser._id;
      $scope.newLink.tags = $scope.newLink.tags.split(' ');
      $http.post('/api/links',  $scope.newLink );
      $scope.newLink = {};
    };
    $scope.newLink = {};

    Auth.getCurrentUser().$promise.then(function(user){
      $scope.currentUser = user;
      $scope.getLinks();
    });

    $scope.getLinks = function(){
      $http.get('/api/links/getByUser/' + $scope.currentUser._id).success(function(links) {
        $scope.links = links;
      });
    };

    $scope.getLinksByTags = function(){
      $scope.searchFilterTags = $scope.searchFilterTags.split(' ');
      $http.get('/api/links/getByTags/' + $scope.searchFilterTags).success(function(links) {
        $scope.searchresultLinks = links;
      });
    };
  });
