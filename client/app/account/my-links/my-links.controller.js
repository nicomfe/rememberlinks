'use strict';

RememberLinksApp.controller('MyLinksCtrl', function ($scope, Auth, $http) {
    $scope.addLink = function() {
      $scope.newLink.userId = $scope.currentUser._id;
      $scope.newLink.tags = $scope.newLink.tags.split(' ');
      $scope.newLink.date = new Date();
      $http.post('/api/links',  $scope.newLink ).success(function(){
        console.debug('success adding link');
      })
      .error(function(data) {
        console.log('Error adding link: ');
        console.error(data);
      });
      $scope.newLink = {};
    };
    $scope.newLink = {};

    Auth.getCurrentUser().$promise.then(function(user){
      $scope.currentUser = user;
      $scope.getLinks();
    });

    $scope.getLinks = function(){
      getAllLinks();
    };

    $scope.getLinksByTags = function(){
      $scope.searchFilterTags = ($scope.searchFilterTags) ? $scope.searchFilterTags.split(' ') : '';
      if($scope.searchFilterTags){
        $http.get('/api/links/getByTags/' + $scope.searchFilterTags).success(function(links) {
          $scope.links = links;
        })
        .error(function(data) {
          console.log('Error getting link: ');
          console.error(data);
        });
      }else{
        getAllLinks();
      }

    };

    function getAllLinks(){
      $http.get('/api/links/getByUser/' + $scope.currentUser._id).success(function(links) {
        $scope.links = links;
      })
      .error(function(data) {
        console.log('Error getting all links: ');
        console.error(data);
      });
    }

    $scope.removeLinkById = function(id){
      $http.delete('/api/links/' + id).success(function() {
        console.debug('success removing');
      })
      .error(function(data) {
        console.log('Error removing link: ');
        console.error(data);
      });
    };
  });
