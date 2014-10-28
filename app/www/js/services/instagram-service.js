define([
  "app",
  "angular",
  "angular-resource"
], function(app) {
  "use strict";

  app.service("InstagramService", [
    "$resource",
    function($resource) {

      var instaAPI = $resource("/api/instagram");

      function getFeed(success) {
        instaAPI.query(success);
      }

      return {
        getFeed: getFeed
      }
    }
  ]);
});