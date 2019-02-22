# HANIoTDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

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