var express = require('express');
var http = require('https');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

var access_tokens = require('./server/access_tokens.js');

var cacheLife = 15000; //milliseconds

var instafeed = [];
var instaTimestamp = 0;
var twitterfeed = [];
var twitterTimestamp = 0;

// Setting PORT, defaults to 3000
app.set('port', process.env.PORT || 3000);

// Setting static folder to app/www/
app.use('/', express.static(__dirname + '/app/www'));


app.get('/api/', function(req, res) {
  res.send("Yolotroll ");
});

function isCacheOutdated(data, timestamp) {
  if (!Array.isArray(data)) {
    return true;
  }

  if (!data) {
    return true;
  }

  if (data.length === 0) {
    return true;
  }

  if (!timestamp) {
    return true;
  }

  if (timestamp < new Date().getTime()) {
    return true;
  }

  return false;
}

function getInstas(callback) {
  if (!isCacheOutdated(instafeed, instaTimestamp)) {
    callback(instafeed);
  } else {
    fetchInstagramFeed(function(instas) {
      instaTimestamp = new Date().getTime() + cacheLife;
      console.log("[" + new Date().getTime() + "] " + "Instagram Feed updated");
      instafeed = instas;
      callback(instas);
    });
  }
}


function getTweets(callback) {
  if (!isCacheOutdated(twitterfeed, twitterTimestamp)) {
    callback(twitterfeed);
  } else {
    fetchTwitterFeed(function(tweets) {
      twitterTimestamp = new Date().getTime() + cacheLife;
      console.log("[" + new Date().getTime() + "] " + "Twitter Feed updated");
      twitterfeed = tweets;
      callback(tweets);
    });
  }
}

// Returns default Twitter feed
app.get('/api/twitter/', function(req, res) {

  getTweets(function(data) {
    res.set("Content-Type", "application/json");
    res.send(data);
  });

});

// Returns default Instagram feed
app.get('/api/instagram', function(req, res) {
  getInstas(function(data) {
    res.set("Content-Type", "application/json");
    res.send(data);
  });
});

function fetchInstagramFeed (callback) {
  "use strict";

  var auth_query = "access_token=" + access_tokens.instagram;
  var path = '/v1/tags/dagenatifi/media/recent?count=6&' + auth_query;
  var options = {
    host: 'api.instagram.com',
    path: path,
    method: 'GET'
  };

  var httpreq = http.request(options, function (response) {
    var chunked_response = "";
    response.setEncoding("utf8");

    response.on('data', function(chunk) {
      chunked_response += chunk;
    });

    response.on('error', function(error) {
      console.log(error);
    });

    response.on('end', function () {
      try {
        callback(JSON.parse(chunked_response).data);
      } catch(err) {
        console.log("Could not retreive instagram feed");
        console.log(err);
      }
    });
  });

  httpreq.write("");
  httpreq.end();
}

function fetchTwitterFeed (callback) {

  var auth_header = "Bearer " + access_tokens.twitter;

  var options = {
    host: 'api.twitter.com',
    path: "/1.1/search/tweets.json?q=%23dagenatifi+OR+dagenatifi+OR+%40dagenatifi+exclude:retweets&count=10&result_type=recent",
    method: 'GET',
    headers: {
      'User-Agent': 'dagen_social_feed',
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': auth_header
    }
  };

  var httpreq = http.request(options, function (response) {
    //Collect data
    var chunked_response = "";
    response.setEncoding("utf8");

    //While we get chuncks of data, append to full result.
    response.on('data', function(chunk) {
      chunked_response += chunk;
    });

    //When we reach end of response, callback with response
    response.on('end', function() {
      callback(JSON.parse(chunked_response).statuses);
    });
  });

  httpreq.write("");
  httpreq.end();
}

app.listen(app.get('port'));
console.log("Server running at " + app.get('port'));
