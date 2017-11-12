FROM node:8

ARG TYPESCRIPT_VERSION=2.5.3

RUN npm i -g typescript@$TYPESCRIPT_VERSION
RUN npm i -g ts-node

COPY app /var/app

WORKDIR /var/app

RUN npm install

EXPOSE 80