const { BadRequestError } = require('./errors')
const Utils = require('./utils')

module.exports = class ValidationService {
  static validate (schema, data, opts) {
    const { error, value } = schema.validate(data, { abortEarly: false, ...opts })
    if (error) {
      throw new BadRequestError(error.message, error.details
        .map(err => Utils.pick(err, [{ path: 'path[0]' }, 'message'])))
    }

    return value
  }
}
