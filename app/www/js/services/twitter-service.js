define([
  "app",
  "angular",
  "angular-resource"
], function(app) {
  "use strict";

  app.service("TwitterService", [
    "$resource",
    function($resource) {

      var twitterAPI = $resource("/api/twitter");

      function getFeed(success) {
        twitterAPI.query(success);
      }

      return {
        getFeed: getFeed
      }
    }
  ]);
});