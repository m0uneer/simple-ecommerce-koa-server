const Passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const Config = require('config')
const jwt = require('jsonwebtoken')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const authService = require('./auth-service')
const User = require('../models/user')

const log = require('../../../lib/loggers/logger').get('auth')

module.exports = {
  configPassport () {
    Passport.serializeUser((user, done) => done(null, user.id))

    Passport.deserializeUser((id, done) => {
      User.findByPk(id, { assertTenant: false })
        .then(user => done(null, user || null))
        .catch(err => {
          log.w(`Failed to deserializeUser id ${id} `, err)
          done(err)
        })
    })

    const localStrategyOptions = { usernameField: 'email', passwordField: 'password' }
    Passport.use(new LocalStrategy(localStrategyOptions, (username, password, done) => {
      authService.login(username, password)
        .then(user => {
          const accessToken = jwt.sign(user, Config.get('Jwt.Secret'), {
            expiresIn: Config.get('Jwt.AccessTokenExpiry')
          })

          const refreshToken = jwt.sign(user, Config.get('Jwt.Secret'), {
            expiresIn: Config.get('Jwt.RefreshTokenExpiry')
          })

          done(null, user ? { ...user, accessToken, refreshToken } : false)
        })
        .catch(done)
    }))

    const jwtStrategyOptions = {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.get('Jwt.Secret')
    }

    Passport.use(new JWTStrategy(jwtStrategyOptions, (jwtPayload, cb) => {
      return User.findByPk(jwtPayload.id)
        .then(user => cb(null, user))
        .catch(cb)
    }))

    return Passport
  }
}
