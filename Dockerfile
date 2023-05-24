FROM node:18-alpine as base
EXPOSE 3000
RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY . /app

CMD ["yarn", "docker:start"]
