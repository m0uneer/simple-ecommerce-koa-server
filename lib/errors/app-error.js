const Utils = require('../utils')

module.exports = class AppError extends Error {
  constructor (msgBase, errors, errOpts = { }) {
    super(Utils.formatUnicorn(msgBase, errOpts))
    this.errOpts = errOpts
    this.errors = errors
  }

  getMsg () { return this.message }
  getParams () { return this.errOpts }
  getValidationErrs () { return this.errors }
}
