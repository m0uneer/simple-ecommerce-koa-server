const Umzug = require('umzug')
const Config = require('config')

const log = require('./loggers/logger').get('Migrations')

module.exports = class DbMigration {
  static initUmzug (sequelize) {
    return new Umzug({
      migrations: {
        path: Config.get('App.MigrationDir'),
        params: [
          sequelize.getQueryInterface()
        ]
      },
      storage: 'sequelize',
      logging: str => log.d(str),
      storageOptions: {
        sequelize
      }
    })
  }

  static applyMigrations (sequelize) {
    const umzug = DbMigration.initUmzug(sequelize)

    // Checks migrations and run them if they are not already applied. To keep
    // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
    // will be automatically created (if it doesn't exist already) and parsed.
    if (Config.get('Db.dialect') !== 'sqlite') return umzug.up()
  }
}
