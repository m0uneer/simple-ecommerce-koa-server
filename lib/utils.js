const Path = require('path')
const _ = require('lodash')
const Glob = require('glob')

module.exports = {
  loadModules (dir, excludedName, match = '') {
    return Glob.sync(`${dir}/!(*.test*|${excludedName})${match}.js`)
      .map(filePath => {
        const parsed = Path.parse(filePath)
        const moduleDir = parsed.dir.split('/').slice(-2, -1)[0]
        return { fileName: parsed.name, file: require(filePath), moduleDir }
      })
  },

  formatUnicorn (message, messageParams) {
    if (messageParams) {
      _.forOwn(messageParams, (value, key) => {
        message = message.replace(new RegExp('\\{' + key + '\\}', 'gi'), value)
      })
    }

    return message
  },

  pick (obj, keyList) {
    return keyList.reduce((acc, k) => {
      const [setKey, getKey] = _.isPlainObject(k) ? [_.keys(k)[0], k[_.keys(k)[0]]] : [k, k]
      return _.set(acc, setKey, _.get(obj, getKey))
    }, {})
  }
}
