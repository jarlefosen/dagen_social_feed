#!/bin/bash

echo "Clone repository"
git clone --quiet https://github.com/jarlefosen/dagen_social_feed.git /tmp/dagen_feed
echo "Checkout docker_image"
git checkout docker_image
echo "Symlink access_token.js"
ln -s /tmp/access_tokens.js /tmp/dagen_feed/server/access_tokens.js

cd /tmp/dagen_feed

npm start
