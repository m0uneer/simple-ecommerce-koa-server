const Path = require('path')
const Fs = require('fs').promises
const Config = require('config')

const Logger = require('../loggers/logger')

const log = Logger.get('LocalStorage')
const localUploadsDir = Config.get('StorageProvider.LocalUploadsDir')
const localUploadsFolder = Config.get('StorageProvider.LocalUploadsFolder')

module.exports = class LocalStorage {
  static uploadBatch (parentDirName, fileList) {
    return Promise.all(fileList.map(async ({ name, data }) => {
      const [fileDir, fileName] = name.split(/\/(?=[^/]+$)/)
      const dirPath = Path.resolve(localUploadsDir, parentDirName, fileDir)
      const isDirExists = !!await Fs.access(dirPath).then(() => true).catch(() => false)
      if (!isDirExists) await Fs.mkdir(dirPath, { recursive: true })
      const filePath = Path.resolve(dirPath, fileName)
      const buffer = Buffer.isBuffer(data) ? data : Buffer.from(JSON.stringify(data, null, 2))
      await Fs.writeFile(filePath, buffer)
      log.d('uploadBatch()', 'file path', filePath)
      return filePath
    }))
  }

  static async getUrl (parentDirName, filePath) {
    const baseDirName = parentDirName ? `/${parentDirName}` : ''
    const path = `${localUploadsDir}${baseDirName}/${filePath}`
    if (!await Fs.stat(path).catch(() => false)) return
    return `${Config.get('App.BaseURL')}${localUploadsFolder}${baseDirName}/${filePath}`
  }
}
