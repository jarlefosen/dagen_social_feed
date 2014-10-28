define([
  "app",
  "angular-resource"
], function(app) {
  "use strict";

  app.factory("TwitterAPI", [
    "$resource", "$q",
    function($resource) {

      var searchTwitter = $resource("/api/twitter");

      return {
        search : searchTwitter.get
      }
    }
  ]);

});