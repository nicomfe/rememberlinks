'use strict';

RememberLinksApp.controller('MyLinksCtrl', function ($scope, Auth, $http, LinkService, messages) {
    $scope.addLink = function() {
      $scope.newLink.userId = $scope.currentUser._id;
      $scope.newLink.tags = $scope.newLink.tags.split(' ');
      LinkService.add($scope.newLink).then(function(linkAdded){
        $scope.links.push(linkAdded);
      })
      .catch(function(err){
        console.log('TODO handle error' + err);
      });
      $scope.newLink = {};
    };
    $scope.newLink = {};

    $scope.init = function(){
      Auth.getCurrentUser().$promise.then(function onSuccess(user) {
        $scope.currentUser = user;
        getAllLinks();
        cleanErrorMessage();
      }, function onError() {
        displayError(messages.UNEXPECTED_ERROR);
      });
    };
    $scope.init();

    $scope.getLinksByTags = function(){
      $scope.searchFilterTags = ($scope.searchFilterTags) ? $scope.searchFilterTags.split(' ') : '';
      if($scope.searchFilterTags){
        LinkService.getByTags($scope.searchFilterTags).then(function(links){
          $scope.links = links;
        },function(err){
          console.log('TODO handle error' + err);
        });
      }else{
        getAllLinks();
      }
    };

    function cleanErrorMessage(){
      $scope.errorMessage = '';
    }
    function displayError(message){
      $scope.errorMessage = message;
      // TODO Add functonality to display the error just for a while
      // and then hide it in the UI and delete the variable from scope
    };

    function getAllLinks(){
      LinkService.getByUser($scope.currentUser).then(function(links){
        $scope.links = links;
      },function(err){
        console.log('TODO handle error' + err);
      });
    };

    $scope.removeLinkById = function(id){
      LinkService.removeById(id).then(function(success){
        if(success){
          $scope.links = $scope.links.filter(function (el) {
            return el._id !== id;
          });
        }
      },function(err){
        console.log('TODO handle error' + err);
      });
    };

    $scope.editLink = function(linkToBeUpdated) {
      $scope.linkToUpdate = linkToBeUpdated;
      $scope.displayEditId = linkToBeUpdated._id;
    };

    $scope.updateLink = function(linkToUpdate) {
      LinkService.update(linkToUpdate).then(function(){
        $scope.displayEditId = '';
      },function(err){
        console.log('TODO handle error' + err);
      });
    };
  });
