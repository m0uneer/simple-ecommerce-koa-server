const Passport = require('koa-passport')
const jwt = require('jsonwebtoken')
const Config = require('config')
const { promisify } = require('util')

const AuthenticatedUrls = require('./authenticated-urls')
const Result = require('../../../lib/response/result')
const User = require('../models/user')

module.exports = {
  middleware (ctx, next) {
    const guestRoutes = AuthenticatedUrls.getGuestRoutes()

    return Passport.authenticate('jwt', { session: false }, async (error, user, info, status) => {
      if (error) {
        throw error
      }

      if (!user && !info && !status) {
        // invalid token
        ctx.body = Result.forbidden('Forbidden!')
        return
      }

      if (ctx.request.path === '/api/users/refresh-token' && ctx.request.method === 'POST') {
        const refreshToken = ctx.request.body.refreshToken
        if (!(info instanceof jwt.TokenExpiredError) || !refreshToken) {
          ctx.body = Result.forbidden('Forbidden!')
          return
        }

        const jwtPayload = await promisify(jwt.verify)(refreshToken, Config.get('Jwt.Secret'))
        const user = await User.findByPk(jwtPayload.id)
        const accessToken = jwt.sign(user.toJSON(), Config.get('Jwt.Secret'), {
          expiresIn: Config.get('Jwt.AccessTokenExpiry')
        })

        ctx.body = Result.ok({ accessToken })
        return
      }

      if (info instanceof jwt.TokenExpiredError) {
        ctx.body = Result.unauthorized('Token Expired!')
        return
      }

      if (user) ctx.login(user, { session: false })

      // Redirect If Authenticated
      // prevent open [login/register page] if user logged in
      if (ctx.isAuthenticated() && guestRoutes.some(link => ctx.url.includes(link))) {
        ctx.body = Result.ok('Logged in!')
        return
      }

      if (ctx.isAuthenticated()) {
        return next()
      }

      const isAllowedRoute = guestRoutes.some(link => ctx.url.includes(link))

      if (!isAllowedRoute) {
        ctx.body = Result.unauthorized('Unauthorized!')
        return
      }

      return next()
    })(ctx, next)
  }
}
