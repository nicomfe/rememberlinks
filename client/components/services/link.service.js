'use strict';

RememberLinksApp.factory('LinkService', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
  return {
    getByUser: function(currentUser){
      var deferred = $q.defer();
      $http.get('/api/links/getByUser/' + currentUser._id).success(function(links) {
        deferred.resolve(links);
      })
      .error(function(data) {
        console.log('Error getting all links: ');
        console.error(data);
        deferred.reject(data);
      });
      return deferred.promise;
    },
    getByTags: function(tags){
      var deferred = $q.defer();
      $http.get('/api/links/getByTags/' + tags).success(function(links) {
        deferred.resolve(links);
      })
      .error(function(data) {
        console.log('Error getting link: ');
        console.error(data);
        deferred.reject(data);
      });
      return deferred.promise;
    },
    add: function(link){
      var deferred = $q.defer();
      $http.post('/api/links',link).success(function(linkAdded){
        deferred.resolve(linkAdded);
      })
      .error(function(data) {
        console.log('Error adding link: ');
        console.error(data);
        deferred.reject(data);
      });
      return deferred.promise;
    },
    update: function(link){
      var deferred = $q.defer();
      $http.put('/api/links/'+link._id,link).success(function(){
        deferred.resolve(true);
      })
      .error(function(data) {
        console.log('Error updating link: ');
        console.error(data);
        deferred.reject(data);
      });
      return deferred.promise;
    }
  };
});