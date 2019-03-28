# Download Node image from Docker Hub Repository
FROM node:10.15.3

# create and set app directory
RUN mkdir -p /usr/src/db
WORKDIR /usr/src/db 

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json /usr/src/db
RUN npm install
COPY . /usr/src/db

EXPOSE 4200

ENTRYPOINT npm run build && node server.js