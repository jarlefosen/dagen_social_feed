#!/bin/bash

BRANCH="docker_image"
APP_LOCATION="/tmp/dagen_feed"

echo "Clone repository from branc $BRANCH"
git clone --quiet https://github.com/jarlefosen/dagen_social_feed.git --branch $BRANCH $APP_LOCATION

cd $APP_LOCATION
npm install
npm start
