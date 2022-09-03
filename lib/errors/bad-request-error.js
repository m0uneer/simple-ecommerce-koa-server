const AppError = require('./app-error')
const Status = require('../response/status')

module.exports = class BadRequestError extends AppError {
  constructor (msgBase, errors, errOpts) {
    super(msgBase, errors, errOpts)
    this.type = 'badRequest'
    this.status = Status.badRequest
  }
}
