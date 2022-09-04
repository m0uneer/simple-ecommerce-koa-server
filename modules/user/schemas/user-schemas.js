const Joi = require('joi')

module.exports = class UserSchemas {
  static get registration () {
    return Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    })
  }

  static get login () {
    return Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }
}
