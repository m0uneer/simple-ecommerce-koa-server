const { Sequelize } = require('sequelize')
const sequelizeHookTypes = require('sequelize/lib/hooks').hooks

module.exports = class AppModel extends Sequelize.Model {
  static init (attributes, options) {
    const hooks = this.getModelHooks()
    return super.init(attributes, {
      hooks,
      ...options
    })
  }

  static getModelHooks () {
    let allHooks = []
    let targetModel = this
    while (targetModel !== Sequelize.Model) {
      allHooks = allHooks.concat(Object.getOwnPropertyNames(targetModel))
      targetModel = Object.getPrototypeOf(targetModel)
    }

    return Array.from(new Set(allHooks)).reduce((acc, prop) => {
      if (!sequelizeHookTypes[prop]) {
        return acc
      }

      acc[prop] = this[prop].bind(this)
      return acc
    }, {})
  }

  static beforeCreate (model) {
    const modelOptions = this.sequelize.models[this.name].options
    const timestamps = modelOptions.timestamps
    if (!timestamps) return
    const createdAt = modelOptions.createdAt
    if (!createdAt) return
    model.setDataValue(createdAt, new Date())
    this.beforeUpdate(model)
  }

  static beforeUpdate (model) {
    const modelOptions = this.sequelize.models[this.name].options
    const timestamps = modelOptions.timestamps
    if (!timestamps) return
    const updatedAt = modelOptions.updatedAt
    if (!updatedAt) return
    model.setDataValue(updatedAt, new Date())
  }
}
