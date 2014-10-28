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
    console.log("Data is not array");
    return true;
  }

  if (!data) {
    console.log("Data is not defined");
    return true;
  }

  if (data.length === 0) {
    return true;
  }

  if (!timestamp) {
    console.log("Timestamp is undefined");
    return true;
  }

  if (timestamp < new Date().getTime()) {
    console.log("Timestamp outdated");
    return true;
  }

  return false;
}

function getInstas(callback) {
  if (!isCacheOutdated(instafeed, instaTimestamp)) {
    console.log("Data from cache");
    console.log("Valid for " + (instaTimestamp - new
      Date().getTime())/1000 + " seconds");
    callback(instafeed);
  } else {
    console.log("Getting instas from server ...");
    fetchInstagramFeed(function(instas) {
      console.log("Got instas!");
      instaTimestamp = new Date().getTime() + cacheLife;
      instafeed = instas;
      callback(instas);
    });
  }
}


function getTweets(callback) {
  if (!isCacheOutdated(twitterfeed, twitterTimestamp)) {
    console.log("Data from cache");
    console.log("Valid for " + (twitterTimestamp - new
  Date().getTime())/1000 + " seconds");
    callback(twitterfeed);
  } else {
    console.log("Getting tweets from server ...");
    fetchTwitterFeed(function(tweets) {
      console.log("Got tweets!");
      twitterTimestamp = new Date().getTime() + cacheLife;
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
  console.log(auth_query);
  console.log("access_token=274085929.3fe2de0.bf471b93e15a4852b9ae5c8d04ef9291");
  var path = '/v1/tags/dagenatifi/media/recent?count=6&' + auth_query;
  console.log(path);
  var options = {
    host: 'api.instagram.com',
    path: path,
    method: 'GET'
  };

  var httpreq = http.request(options, function (response) {
    var chunked_response = "";
    response.setEncoding("utf8");

    response.on('data', function(chunk) {
      console.log("Chunk ->");
      console.log(chunk);
      chunked_response += chunk;
    });

    response.on('error', function(error) {
      console.log("OMGLOL got Error");
      console.log(error);
    });

    response.on('end', function () {
      try {
        console.log(chunked_response);
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
    path: "/1.1/search/tweets.json?q=%23dagenatifi+OR+dagenatifi+OR+%40dagenatifi&count=10&result_type=recent",
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
