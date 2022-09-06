const AppRouter = require('../../../lib/routes/app-router')
const Urls = require('../constants/urls')
const Messages = require('../constants/messages')
const AuthService = require('../services/auth-service')
const UserService = require('../services/user-service').init()

module.exports = class UserRouter extends AppRouter {
  init (router) {
    router.post(Urls.postRegisterUser, `${this.prefix}/register`, async ctx => {
      await UserService.registerUser(ctx.request.body)
      ctx.body = this.Result.ok({ }, Messages.successRegistration)
    })

    router.post(Urls.postLoginUser, `${this.prefix}/login`, async ctx => {
      const user = await AuthService.authenticate(ctx.request.body)(ctx)
      ctx.body = this.Result.ok(user)
    })
  }
}
