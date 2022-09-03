const AppError = require('./app-error')
const Status = require('../response/status')

module.exports = class NotFoundError extends AppError {
  constructor (msgBase, errors, errOpts) {
    super(msgBase, errors, errOpts)
    this.type = 'notFound'
    this.status = Status.notFound
  }
}
