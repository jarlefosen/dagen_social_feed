# DOCKERFILE VERSION 0.0.2

FROM ubuntu:14.04

# Install ubuntu packages
RUN apt-get update -y
RUN apt-get install -y nodejs npm git git-core

# Fix nodejs -> node
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install bower globally
RUN npm install -g bower

# Clone repository
RUN git clone --quiet https://github.com/jarlefosen/dagen_social_feed.git --branch docker_image /tmp/dagen_feed
RUN cd /tmp/dagen_feed && npm install
RUN cd /tmp/dagen_feed/app && bower install --allow-root

# Access tokens defined in ENV
ENV DAGEN_TWITTER [INSERT_TWITTER_TOKEN]
ENV DAGEN_INSTAGRAM [INSERT_INSTAGRAM_TOKEN]

# Start node application
CMD cd /tmp/dagen_feed && node server.js
