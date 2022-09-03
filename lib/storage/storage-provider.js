const Config = require('config')

const log = require('../loggers/logger').get('StorageProvider')

const providerName = Config.get('StorageProvider.Default')
module.exports = {
  getProvider () {
    log.d(`Currently, is: ${providerName}`)
    return require(`./storage-${providerName}-provider`)
  }
}
