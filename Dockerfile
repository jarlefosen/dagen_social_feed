# Select base image to work on
FROM ubuntu:14.04

# Update apt
RUN apt-get update -y

# Install nodejs, npm, git and git-core
RUN apt-get install -y nodejs npm git git-core nodejs-legacy

ADD start.sh /tmp/start.sh
ADD server/access_tokens.js /tmp/access_tokens.js

RUN chmod +x /tmp/start.sh

# Run on container build
CMD ./tmp/start.sh
