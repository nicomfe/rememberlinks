'use strict';

RememberLinksApp.controller('MyLinksCtrl', function ($scope, Auth, $http) {
    $scope.addLink = function() {
      $scope.newLink.userId = $scope.currentUser._id;
      $http.post('/api/links',  $scope.newLink );
      $scope.newLink = {};
    };
    $scope.newLink = {};

    Auth.getCurrentUser().$promise.then(function(user){
      console.log('1');
      $scope.currentUser = user;
      $scope.getLinks();
    });

    $scope.getLinks = function(){
      console.log('2');
      $http.get('/api/links/getByUser/' + $scope.currentUser._id).success(function(links) {
        console.log(links);
        $scope.links = links;
      });
    }
  });
