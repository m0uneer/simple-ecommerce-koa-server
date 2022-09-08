module.exports = {
  up (queryInterface, SequelizeHelper, DataTypes) {
    return queryInterface.createTable('Product', {
      id: SequelizeHelper.field(DataTypes.INTEGER, { primaryKey: true }),
      name: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      code: SequelizeHelper.field(DataTypes.STRING, { allowNull: false, unique: true }),
      category: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      image: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      price: SequelizeHelper.field(DataTypes.DECIMAL, { allowNull: false }),
      quantity: SequelizeHelper.field(DataTypes.INTEGER, { allowNull: false }),
      discount: SequelizeHelper.field(DataTypes.INTEGER, { allowNull: false }),
      createdAt: SequelizeHelper.field(DataTypes.DATE, { allowNull: false }),
      updatedAt: SequelizeHelper.field(DataTypes.DATE, { allowNull: false })
    })
  },

  down (queryInterface) {
    return queryInterface.dropTable('Product')
  }
}
