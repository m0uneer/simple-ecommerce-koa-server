module.exports = {
  up (queryInterface, SequelizeHelper, DataTypes) {
    return queryInterface.createTable('User', {
      id: SequelizeHelper.field(DataTypes.INTEGER, { primaryKey: true }),
      username: SequelizeHelper.field(DataTypes.STRING(64), { allowNull: false, unique: true }),
      email: SequelizeHelper.field(DataTypes.STRING(300), { allowNull: false, unique: true }),
      password: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      role: SequelizeHelper.field(DataTypes.STRING, { allowNull: false }),
      lastLoginAt: SequelizeHelper.field(DataTypes.DATE),
      createdAt: SequelizeHelper.field(DataTypes.DATE, { allowNull: false }),
      updatedAt: SequelizeHelper.field(DataTypes.DATE, { allowNull: false })
    })
  },

  down (queryInterface) {
    return queryInterface.dropTable('User')
  }
}
