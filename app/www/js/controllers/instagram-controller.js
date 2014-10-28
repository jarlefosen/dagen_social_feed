define([
  "app",
  "services/instagram-service"
], function(app) {
  app.controller("InstagramController", [
    "$scope", "$timeout", "InstagramService",
    function($scope, $timeout, InstagramService) {
      "use strict";

      $scope.instagramFeed = [];
      $scope.instaCount = $scope.instagramFeed.length;

      function updateInstagramPosts() {
        InstagramService.getFeed(function(feed) {
          $scope.instagramFeed = feed;
          $scope.instaCount = $scope.instagramFeed.length;
        });

        $timeout(updateInstagramPosts, 5000);
      }

      updateInstagramPosts();

    }
  ])
});
