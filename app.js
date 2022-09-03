const Koa = require('koa')
const KoaLogger = require('koa-logger')
const BodyParser = require('koa-bodyparser')
const Config = require('config')
const { once } = require('events')
const ReqTracer = require('cls-rtracer')
const HyperId = require('hyperid')()
const cors = require('@koa/cors')
const KoaStatic = require('koa-static')
const Path = require('path')

const RouteLoader = require('./lib/routes/route-loader')
const ErrorHandler = require('./middleware/error-handler')
const Authentication = require('./modules/user/middleware/authentication')
const Passport = require('./modules/user/services/passport')
const DbLoader = require('./lib/models/db-loader')
const log = require('./lib/loggers/logger').get('App')

const app = new Koa()
app.startServer = async function () {
  const Db = await DbLoader.init()
  RouteLoader.init(Db)
  const routes = RouteLoader.getRoutes()

  app
    .use(cors())
    .use(ReqTracer.koaMiddleware({ echoHeader: true, requestIdFactory: HyperId }))
    .use(KoaLogger())
    .use(KoaStatic(Path.join(__dirname, 'public'), { maxage: Config.get('Assets.MaxAge') }))
    .use(BodyParser({ ...Config.get('App.BodyParser') }))
    .use(Passport.configPassport().initialize())
    .use(ErrorHandler.catchRouterErrors)
    .use(Authentication.middleware)
    .use(routes.router.routes())
    .use(routes.router.allowedMethods())

  const server = app.listen(process.env.PORT || Config.get('App.Port'))
  await Promise.race([once(server, 'listening'), once(server, 'error')])
  log.d('Server started on http://localhost:' + server.address().port + '/')
  return server
}

module.exports = app
