# Select base image to work on
FROM ubuntu:14.04

# Update apt
RUN apt-get update -y

# Install nodejs, npm, git and git-core
RUN apt-get install -y nodejs npm git git-core

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g bower

# Add start script and make it executable
ADD start.sh /tmp/start.sh
RUN chmod +x /tmp/start.sh

ENV DAGEN_TWITTER [INSERT_TWITTER_TOKEN]
ENV DAGEN_INSTAGRAM [INSERT_INSTAGRAM_TOKEN]

# Run on container build
CMD ./tmp/start.sh
