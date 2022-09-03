const Logger = require('./loggers/logger')

module.exports = {
  handleProcessErrors (appName) {
    const log = Logger.get(appName)

    process.on('uncaughtException', err => {
      log.e('Unhandled Exception at:', err)
      log.i('Exiting the process...')
      log.flush().then(() => process.exit(1))
    })

    process.on('unhandledRejection', (reason, promise) => {
      log.e('Unhandled Rejection at:', promise, 'reason:', reason)
      log.i('Exiting the process...')
      log.flush().then(() => process.exit(1))
    })
  }
}
