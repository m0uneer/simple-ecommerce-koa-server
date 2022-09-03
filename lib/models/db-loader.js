const Path = require('path')
const Sequelize = require('sequelize')
const Config = require('config')

const dbLogger = require('../loggers/db-logger')
const Logger = require('../loggers/logger')
const Utils = require('../utils')
const { getClsNamespace } = require('../../helpers/sequelize-helper')
const { applyMigrations } = require('../db-migrations.js')

const log = Logger.get('DbLoader')
const config = Config.get('Db')
const basename = Path.parse(__filename).name

Sequelize.useCLS(getClsNamespace())

module.exports = class DbLoader {
  static isInitiated = false

  static db = {
    Sequelize
  }

  static async init () {
    log.d('Loading config from', process.env.NODE_CONFIG_ENV, process.env.NODE_CONFIG_DIR)
    if (DbLoader.isInitiated) {
      return DbLoader.db
    }

    log.d('Dialect', config.dialect)
    const sequelize = new Sequelize(config.url, { ...config, logging: dbLogger })

    await sequelize.authenticate()

    log.i('Applying database migrations...')
    await applyMigrations(sequelize)
    const db = DbLoader.db
    db.sequelize = sequelize

    await Promise.all(Utils.loadModules(Config.get('App.ModelsDir'), basename)
      .filter(({ file: model }) => model.init)
      .map(async ({ file: model }) => {
        db[model.name] = await model.init(sequelize, Sequelize.DataTypes)
        db[model.name].db = db
      }))

    // To handle relations
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db)
      }
    })

    if (Config.get('Db.dialect') === 'sqlite') await sequelize.sync()

    DbLoader.isInitiated = true
    return DbLoader.db
  }

  static getDb () {
    if (!DbLoader.isInitiated) {
      throw new Error(`${DbLoader.constructor.name} must be initiated first`)
    }

    return DbLoader.db
  }

  static close () {
    if (!DbLoader.isInitiated) {
      return
    }

    return DbLoader.db.sequelize.close()
  }
}
