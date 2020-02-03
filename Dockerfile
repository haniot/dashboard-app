# Download Node image from Docker Hub Repository
FROM node:12.13.1

# create and set app directory
RUN mkdir -p /usr/src/db
WORKDIR /usr/src/db

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json /usr/src/db
RUN npm install

# Copy app source
COPY . /usr/src/db

# Create self-signed certificates
RUN chmod +x ./create-self-signed-certs.sh
RUN ./create-self-signed-certs.sh

EXPOSE 80
EXPOSE 443

# Build app and start
ENTRYPOINT npm run build && node server.js
