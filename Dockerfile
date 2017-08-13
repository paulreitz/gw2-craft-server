FROM node:8.3.0
MAINTAINER Paul Reitz (avenose@gmail.com)

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src

RUN npm run build



