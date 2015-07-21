'use strict';

RememberLinksApp.controller('MyLinksCtrl', function ($scope, Auth, $http, LinkService) {
    $scope.addLink = function() {
      $scope.newLink.userId = $scope.currentUser._id;
      $scope.newLink.tags = $scope.newLink.tags.split(' ');
      LinkService.add($scope.newLink).catch(function(err){
        console.log('TODO handle error' + err);
      });
      $scope.newLink = {};
    };
    $scope.newLink = {};

    Auth.getCurrentUser().$promise.then(function(user){
      $scope.currentUser = user;
      $scope.getAllLinks();
    });

    $scope.getLinksByTags = function(){
      $scope.searchFilterTags = ($scope.searchFilterTags) ? $scope.searchFilterTags.split(' ') : '';
      if($scope.searchFilterTags){
        LinkService.getByTags($scope.searchFilterTags).then(function(links){
          $scope.links = links;
        },function(err){
          console.log('TODO handle error' + err);
        });
      }else{
        $scope.getAllLinks();
      }
    };

    $scope.getAllLinks = function(){
      LinkService.getByUser($scope.currentUser).then(function(links){
        $scope.links = links;
      },function(err){
        console.log('TODO handle error' + err);
      });
    };

    $scope.removeLinkById = function(id){
      $http.delete('/api/links/' + id).success(function() {
        console.debug('success removing');
      })
      .error(function(data) {
        console.log('Error removing link: ');
        console.error(data);
      });
    };

    $scope.editLink = function(linkToBeUpdated) {
      $scope.linkToUpdate = angular.copy(linkToBeUpdated);
      $scope.displayEdit = true;
    };
    $scope.updateLink = function(linkToUpdate) {
      LinkService.update(linkToUpdate).catch(function(err){
        console.log('TODO handle error' + err);
      });
      console.log('success');
      $scope.displayEdit = false;
    };
  });
