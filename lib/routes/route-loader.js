const Path = require('path')
const KoaRouter = require('koa-router')
const Config = require('config')

const Utils = require('../utils')
const Logger = require('../loggers/logger')
const LogLevels = require('../../constants/log-levels')

const log = Logger.get('routes', LogLevels.DEBUG)

module.exports = class RouteLoader {
  static isInitiated = false
  static routes

  static init () {
    if (RouteLoader.isInitiated) {
      return RouteLoader
    }

    RouteLoader.isInitiated = true

    const router = new KoaRouter()
    const routes = { router }

    Utils
      .loadModules(Config.get('App.RoutesDir'), Path.parse(__filename).name, 'router')
      .forEach(({ file: Router }) => {
        log.t(`Loading router ${Router.name}`)
        routes[Router.name] = (new Router()).init(router)
      })

    log.d('App routes: ', router.stack.map(i => `${i.name} : '${i.path}'`))
    RouteLoader.routes = routes
    return RouteLoader
  }

  static getRoutes () {
    if (!RouteLoader.isInitiated) {
      throw new Error(`${RouteLoader.name} must be initiated first`)
    }

    return RouteLoader.routes
  }
}
