# Select base image to work on
FROM ubuntu:14.04

# Update apt
RUN apt-get update -y

# Install nodejs, npm, git and git-core
RUN apt-get install -y nodejs npm git git-core

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g bower

# Clone repository
RUN git clone --quiet https://github.com/jarlefosen/dagen_social_feed.git --branch docker_image /tmp/dagen_feed
RUN cd /tmp/dagen_feed && npm install
RUN cd /tmp/dagen_feed/app && bower install --allow-root

# Add start script and make it executable
ADD start.sh /tmp/start.sh
RUN chmod +x /tmp/start.sh

ENV DAGEN_TWITTER [INSERT_TWITTER_TOKEN]
ENV DAGEN_INSTAGRAM [INSERT_INSTAGRAM_TOKEN]

# Run on container build
CMD cd /tmp/dagen_feed && npm start
