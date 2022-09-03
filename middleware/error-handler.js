const Joi = require('joi')
const { ValidationError: SequelizeValidationError } = require('sequelize')

const Result = require('../lib/response/result')
const log = require('../lib/loggers/logger').get('ErrorHandler')
const Utils = require('../lib/utils')

module.exports = class ErrorHandler {
  static async catchRouterErrors (ctx, next) {
    try {
      await next()
    } catch (err) {
      log.w('Routes Error Handler', err)

      // 4xx .. Response with descriptive errors
      if (Result[err.type]) {
        // App Error like BadRequestError
        ctx.body = Result[err.type](err.getMsg(), err.getParams(), err.getValidationErrs())
      } else if (err instanceof Joi.ValidationError) {
        ctx.body = Result.badRequest(err.getMsg(), err.getParams(), err.getValidationErrs())
      } else if (err instanceof SequelizeValidationError) {
        ctx.body = Result.badRequest(err.message, { }, err.errors
          .map(err => Utils.pick(err, ['path', 'message'])))
      } else {
        throw err
      }
    }

    ctx.status = ctx.body?.status || ctx.status
  }
}
