const Status = require('./status')
const MessageTypes = require('./message-type')
const Utils = require('../utils')

module.exports = {
  ok (data, message, messageParams) {
    data = data || { }
    return {
      status: Status.ok,
      data,
      messages: [this.getResMessage(message, messageParams, MessageTypes.info)]
    }
  },

  notFound (...params) {
    return this.warn(Status.notFound, ...params)
  },

  badRequest (...params) {
    return this.warn(Status.badRequest, ...params)
  },

  unauthorized (...params) {
    return this.warn(Status.unauthorized, ...params)
  },

  forbidden (...params) {
    return this.warn(Status.forbidden, ...params)
  },

  warn (status, message, messageParams, validationErrors, data) {
    return {
      status,
      messages: [this.getResMessage(message, messageParams, MessageTypes.warn)],
      validationErrors: validationErrors || [],
      data: data || { }
    }
  },

  getResMessage (message, messageParams, type = MessageTypes.info) {
    return {
      txt: Utils.formatUnicorn(message || '', messageParams || { }),
      type
    }
  }
}
