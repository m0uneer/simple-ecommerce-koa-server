const Inflection = require('inflection')

const Result = require('../response/result')
const Authorize = require('../../modules/user/middleware/authorization')
const Roles = require('../../constants/roles')

class AppRouter {
  Authorize = Authorize
  Roles = Roles
  Result = Result

  constructor (router) {
    this.router = router
    this.name = Inflection.tableize(this.constructor.name)
      .replace(/_/g, '-').replace('-routers', '')

    this.prefix = `/api/${Inflection.pluralize(this.name)}`
  }
}

module.exports = AppRouter
