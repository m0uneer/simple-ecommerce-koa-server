const Bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const Passport = require('koa-passport')

const { BadRequestError } = require('../../../lib/errors')
const User = require('../models/user')
const Messages = require('../constants/messages')
const UserSchemas = require('../schemas/user-schemas')
const log = require('../../../lib/loggers/logger').get('AuthService')
const ValidationService = require('../../../lib/validation-service')

class AuthService {
  async login (username, password) {
    const user = await User.scope('withPassword').findOne({
      assertTenant: false,
      where: {
        [Op.or]: {
          email: username.toLowerCase(),
          username
        }
      }
    })

    if (!user) {
      throw new BadRequestError(Messages.invalidUsernameOrPassword)
    }

    const passwordMatching = await Bcrypt.compare(password, user.password)

    if (passwordMatching) {
      user.lastLoginAt = new Date()
      await user.save()
      const userJson = user.toJSON()
      delete userJson.password
      return userJson
    }

    throw new BadRequestError(Messages.invalidUsernameOrPassword)
  }

  authenticate (body) {
    return (...args) => {
      ValidationService.validate(UserSchemas.login, body)
      return new Promise((resolve, reject) => Passport.authenticate('local', (err, user) => {
        if (err || user === false) {
          if (err) log.w(err)
          return reject(new BadRequestError(Messages.invalidUsernameOrPassword))
        }

        resolve(user)
      })(...args))
    }
  }
}

module.exports = new AuthService(User)
