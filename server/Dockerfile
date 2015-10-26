FROM node:4

MAINTAINER Jarle Fosen <jarle@fosen.it>

RUN npm install -g nodemon

# Clone repository
WORKDIR /server
RUN mkdir server
COPY package.json ./
RUN npm install
COPY server.js ./

# Access tokens defined in ENV
ENV DAGEN_TWITTER ""
ENV DAGEN_INSTAGRAM ""

# Set application port
ENV DAGEN_PORT 80
EXPOSE 80

# Start node application
CMD nodemon server.js
