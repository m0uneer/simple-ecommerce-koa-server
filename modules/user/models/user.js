const Config = require('config')
const Bcrypt = require('bcryptjs')

const AppModel = require('../../../lib/models/app-model')
const SequelizeHelper = require('../../../helpers/sequelize-helper')
const Roles = require('../../../constants/roles')

module.exports = class User extends AppModel {
  static init (sequelize, DataTypes) {
    return super.init({
      id: SequelizeHelper.field(DataTypes.INTEGER, { primaryKey: true }),
      username: SequelizeHelper.field(DataTypes.STRING(64), { allowNull: false, unique: true }),
      email: SequelizeHelper.field(DataTypes.STRING(300), { allowNull: false, unique: true }),
      password: SequelizeHelper.field(DataTypes.STRING, {
        allowNull: false,
        set (val) {
          this.setDataValue('password', Bcrypt.hashSync(val, Config.get('App.SaltRounds')))
        }
      }),
      role: SequelizeHelper.field(DataTypes.STRING, {
        allowNull: false,
        validate: {
          isValid () {
            if (!Object.values(Roles).includes(this.role)) throw new Error('Invalid Role!')
          }
        }
      }),
      lastLoginAt: SequelizeHelper.field(DataTypes.DATE)
    }, SequelizeHelper.getModelDefaults(this, sequelize, {
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: { withPassword: { attributes: { } } }
    }))
  }
}
