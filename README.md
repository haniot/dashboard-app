# HANIoTDashboard

[![node](https://img.shields.io/badge/node-v10.15.3-red.svg?style=?style=flat-square&logo=node.js)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v6.4.1-red.svg?style=flat-square&logo=npm)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/angular-v7.3.8-orange.svg?style=flat-square&logo=angular)](https://angular.io/)
[![typescript](https://img.shields.io/badge/TypeScript-v3.1.6-blue.svg?style=flat-square&logo=TS)](https://www.typescriptlang.org/)
[![bootstrap](https://img.shields.io/badge/BootStrap-v4.1.3-blue.svg?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)
[![echarts](https://img.shields.io/badge/Echarts-v4.1.0-orange.svg?style=flat-square&logo=echarts)](https://ecomfe.github.io/echarts-doc/public/en/index.html)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

## Development server

Configure the environment variables in the .env file see the .env.example file.

Run `npm install` 

Run `npm run start:dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Development production

Run `npm install` 

Run `npm run start:prod` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



# Docker


##  How to install

Follow all the steps present in the [official documentation](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) starting from the **Install Docker CE** chapter


## Building the project container image


``docker build -t IMAGE_NAME:IMAGE_VERSION DOCKERFILE_PATH``

Example:

``docker build -t haniot-dashboard:v0.1 .``

## Set the environment variables

You can set directly on ``Dockerfile`` or in ``Docker-Compose`` file

## Executing the project container image

``docker run -p HOST_PORT:CONTAINER_PORT -it IMAGE_NAME:IMAGE_VERSION``

Example:

``docker run -p 4200:4200 -it haniot-dashboard:v0.1``

## Access API


``http://localhost:4200``