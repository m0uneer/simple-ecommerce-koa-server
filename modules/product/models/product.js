const AppModel = require('../../../lib/models/app-model')
const SequelizeHelper = require('../../../helpers/sequelize-helper')

module.exports = class Product extends AppModel {
  static init (sequelize, DataTypes) {
    return super.init({
      id: SequelizeHelper.field(DataTypes.INTEGER, { primaryKey: true }),
      name: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      code: SequelizeHelper.field(DataTypes.STRING, { allowNull: false, unique: true }),
      category: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      image: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      price: SequelizeHelper.field(DataTypes.DECIMAL, { allowNull: false }),
      quantity: SequelizeHelper.field(DataTypes.INTEGER, { allowNull: false }),
      discount: SequelizeHelper.field(DataTypes.INTEGER, {
        allowNull: false,
        validate: {
          min: 1,
          max: 100
        }
      })
    }, SequelizeHelper.getModelDefaults(this, sequelize))
  }
}
