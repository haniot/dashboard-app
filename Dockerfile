# Download Node image from Docker Hub Repository
FROM node:10.15.3

# create and set app directory
RUN mkdir -p /usr/src/db
WORKDIR /usr/src/db 

# install app dependencies
COPY package.json /usr/src/db
RUN npm install
COPY . /usr/src/db

EXPOSE 4200

ENTRYPOINT npm run build && node server.js