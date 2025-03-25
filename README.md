## Description

This project was developed as part of the technichal project requested by Conexa in their recruitment process

## Pre Requeirements

Install `docker compose` for running the database. It will have differents ways to install depending the SO. Please check the instructions according to your system.

[Installation Guide](https://docs.docker.com/compose/install/)

Ensure docker is running well, could you validate doing

```bash
$ docker --version
$ docker ps
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start
```

It will run a seeder locally to populate the database with an admin user with the following credentials:

```bash
username: admin
passowrd: admin
```

Once the project is running you can see the endpoint and the documentation in the [Swagger Endpoint](localhost:3000/api). Also, you can run the differents endpoint and authenticate.

Daily if the project is working, at 12am GMT (or 9:00pm GMT-3) an cronjob will be executed locally in order to syncronize the locally database with the StarWars database.

# watch mode

$ npm run start:dev

# production mode

$ npm run start:prod

````

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
````
