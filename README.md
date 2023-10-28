# SIWE App
Sign-in-with-Ethereum (SIWE) application.

## Architecture
Application consist of client web application, backend service and database. 

### Client
Client application is built with [Quasar Framework](https://quasar.dev/). 
This is a Vue.js 3 based framework for building SPA, SSR, PWA, Mobile (Cordova) apps. It has a rich UI components library,
typescript support, linter, platform detection features, and many more.

[WalletConnect](https://walletconnect.com/) is used for supporting Ethereum wallet connection on mobile.
[Pinia](https://pinia.vuejs.org/) is used as a state management library.
[Axios](https://axios-http.com/) is a HTTP client library.

### Backend
Backend is a Node.js application built with [Express.js](https://expressjs.com/) and [Routing Controllers](https://github.com/typestack/routing-controllers).
This popular web framework for Node.js provides a lot of features out of the box, including routing, middleware support. 
Routing Controllers (with dependencies) adds decorators support and object schema validation.

Backend saves data in [PostgreSQL](https://www.postgresql.org/). [Sequelize](https://sequelize.org/) is used as ORM.

[express-session](https://www.npmjs.com/package/express-session) with [express-session-sequelize](https://www.npmjs.com/package/express-session-sequelize)
is used for persistent session management (data stored in Postgres).


## Local installation

### Client
Pre-requisites: `Node.js 20.8.0`

For Node.js version management you can use [nvm](https://github.com/nvm-sh/nvm).
To install and use `Node.js 20.8.0` run:
```
nvm install 20.8.0
```

Start client:
```
cd siwe-client
npm install
npm run dev
```

Application will be available on [http://localhost:8080](http://localhost:8080).

### Backend
Pre-requisites: [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/).

Start backend:
```
cd siwe-backend
docker-compose -f docker-compose-local.yaml up -d
```

Backend listens on port `8000` by default. You can change it in `docker-compose-local.yaml` file. 
Database Docker volume is mounted under `./volumes/postgres-data` directory.