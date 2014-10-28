define([
  "app",
  "services/twitter-service"
], function(app) {
  app.controller("TwitterController", [
    "$scope", "$timeout", "TwitterService",
    function($scope, $timeout, TwitterService) {
      "use strict";

      $scope.twitterFeed = [];
      $scope.twitterCount = $scope.twitterFeed.length;

      function updateTwitterPosts() {
        TwitterService.getFeed(
          function(feed) {
            $scope.twitterFeed = feed;
            $scope.twitterCount = $scope.twitterFeed.length;
          });

        $timeout(updateTwitterPosts, 5000);
      }

      updateTwitterPosts();
    }
  ])
});
