# DAGEN @ IFI - Social Feed

## About
Client web application written in Angular JS.
Server application written in NodeJS with Express.

## Tools
* [NPM - Node Package Manager](http://nodejs.org/)
* Bower - Web package manager

## Setup

Install NPM (included in Nodejs).

```
$ npm install
```

This will install all frameworks used in the app.

```
$ npm start
```
Should install dependencies and run the application.
Visit http://localhost:3000/ to see result.

## Configuration

**STANDALONE**

Go to `server/_access_tokens.js` and rename it to `server/access_tokens.js` and add your tokens before running the application.

**DOCKER**

Override `Dockerfile` environment variables `DAGEN_TWITTER` and `DAGEN_INSTAGRAM`.

```
FROM jarlefosen/dagen_feed

ENV DAGEN_TWITTER [INSERT_TWITTER_TOKEN]
ENV DAGEN_INSTAGRAM [INSERT_INSTAGRAM_TOKEN]
```
