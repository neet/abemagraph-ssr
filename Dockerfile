FROM node:9-alpine

LABEL maintainer="https://github.com/f0reachARR/abemagraph-ssr" \
      description="AbemaGraph Backend & Frontend Repository"

ENV NODE_ENV=development \
    NODE_PATH=/abemagraph

EXPOSE 8080

WORKDIR /abemagraph

RUN apk -U upgrade \
 && apk add \
    curl \
    git \
    nodejs \
    nodejs-npm \
    yarn \
 && rm -rf /var/cache/apk/*

COPY package.json yarn.lock /abemagraph/

RUN yarn --pure-lockfile \
 && yarn cache clean

COPY . /abemagraph

RUN node_modules/.bin/webpack \
 && node_modules/.bin/tsc -p .

CMD ["node", "/abemagraph/bin/app.js"]
