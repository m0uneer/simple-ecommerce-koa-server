const User = require('../models/user')
const UserSchemas = require('../schemas/user-schemas')
const ValidationService = require('../../../lib/validation-service')
const Roles = require('../../../constants/roles')

module.exports = class UserService {
  constructor (userModel) {
    this.User = userModel
  }

  static init () {
    return new UserService(User)
  }

  registerUser (registerData) {
    const validData = ValidationService.validate(UserSchemas.registration, registerData)
    return this.User.create({ ...validData, role: Roles.Commoner })
  }
}
