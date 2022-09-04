const Joi = require('joi')

module.exports = class ProductSchemas {
  static get addProduct () {
    return Joi.object().keys({
      name: Joi.string().required(),
      category: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().integer().required(),
      discount: Joi.number().integer().min(0).max(100).required()
    })
  }

  static get updateProduct () {
    return Joi.object().keys({
      name: Joi.string(),
      category: Joi.string(),
      price: Joi.number(),
      quantity: Joi.number().integer(),
      discount: Joi.number().integer().min(0).max(100)
    })
  }
}
