[![CI/CD Pipeline](https://github.com/m0uneer/simple-ecommerce-koa-server/actions/workflows/workflow.yml/badge.svg?branch=master)](https://github.com/m0uneer/simple-ecommerce-koa-server/actions/workflows/workflow.yml)
[![codecov](https://codecov.io/gh/m0uneer/simple-ecommerce-koa-server/branch/master/graph/badge.svg?token=8F4N1DQL68)](https://codecov.io/gh/m0uneer/simple-ecommerce-koa-server)

# simple-ecommerce-koa-server
## Project setup
- Make sure node version is 16
- `$ npm install`

### Run
- `$ npm run start`

### Tests
- `$ npm run test`

### Development
- `$ npm run start`
- `$ npm run dev` for hot reloading

### Config
By default, without any code customization, the app will start with sqlite connection,
but we can customize by creating `local.js`

```javascript=
module.exports = {
  Db: {
    // url: 'mysql://user:pass@localhost/dbname',
    // dialect: 'mysql',
    // url: 'postgres://user:pass@localhost/dbname',
    // dialect: 'postgres',
    url: 'sqlite:db.sqlite',
    dialect: 'sqlite',
    }
  }
```

## What is included
- [x] RESTful products crud with serving product images
- [x] User register/login with JWT
- [x] Validation with Joi
- [x] Refreshing token mechanism
- [x] Architectural designs: "Model-Controller API", "Layered" and "Modular" Architectures
- [x] Single point of app configuration management with `Node Config` that supports different environments
- [x] Autoload for app models and controllers (Routers). Check `db-loader.js` and `router-loader.js`
- [x] Basic role-based authorization
- [x] App errors `lib/errors` for better error control
- [x] App and db loggers
- [x] Consistent response interface `{ status, messages, validationErrors, data }`. Check `lib/response/result.js`
- [x] Storage provider pattern `lib/storage` to easily implement more providers like `AWS S3`
- [x] Unit tests with Jest. Ex: product-service.test.js and user-service.test.js
- [x] Integration test with Jest and Supertest. Ex: product-router.test.js
- [x] Coverage with Codecov
- [x] Linters
- [x] Semantic releasing to manage package versions, releasing, and generate changelog documentation
- [x] CICD Pipeline with GitHub actions. It checks npm audit, lint, run tests, upload to Codecov, deploy, and semantic release
- [x] Conventional commit messages with Git-cz and Husky

## Live
- This repository: https://simple-ecommerce-koa-server.herokuapp.com
- Vue Client: https://vue-simple-ecommerce-app.web.app/

## Frontend Vue repository
https://github.com/m0uneer/vue-simple-ecommerce-app
