# Download Node image from Docker Hub Repository
FROM node:10.14.1

# Create a new folder in the container
RUN mkdir -p /usr/src/db

WORKDIR /usr/src/db 

ENV PATH /usr/src/db/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/db/ 

RUN npm install

COPY . /usr/src/db 

EXPOSE 4200

ENTRYPOINT ng serve --host 0.0.0.0