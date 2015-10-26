FROM node:4

RUN npm install -g http-server bower && mkdir app

WORKDIR app/

COPY .bowerrc bower.json ./

RUN bower install --allow-root

COPY www/ www/

EXPOSE 80

CMD http-server -p 80 www
