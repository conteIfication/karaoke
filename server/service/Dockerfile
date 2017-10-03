FROM node:8

ARG YARN_VERSION=1.1.0
ARG TYPESCRIPT_VERSION=2.5.3

COPY package /var/app
COPY service/pm2.json /var/app/pm2.json

WORKDIR /var/app

RUN npm install -g -s --no-progress \
    yarn@$YARN_VERSION \
    typescript@$TYPESCRIPT_VERSION

EXPOSE 80
