const AppError = require('./app-error')
const Status = require('../response/status')

module.exports = class ForbiddenError extends AppError {
  constructor (msgBase, errors, errOpts) {
    super(msgBase, errors, errOpts)
    this.type = 'forbidden'
    this.status = Status.forbidden
  }
}
