const SequelizeMock = require('sequelize-mock')

const UserService = require('./user-service')
const UserFixtures = require('../fixtures/user-fixtures')
const { BadRequestError } = require('../../../lib/errors')

const DBConnectionMock = new SequelizeMock()
const userMock = DBConnectionMock.define('User', UserFixtures.getUser())
const userService = new UserService(userMock)

describe('UserService', () => {
  describe('Adding new user', () => {
    it('should fail if data is not valid', async () => {
      const data = UserFixtures.getUser()
      data.email = 'invalid value'
      try {
        userService.registerUser(data)
      } catch (err) {
        // eslint-disable-next-line jest/no-conditional-expect
        await expect(err).toBeInstanceOf(BadRequestError)

        // eslint-disable-next-line jest/no-conditional-expect
        return expect(err).toHaveProperty('message', '"email" must be a valid email')
      }
    })

    it('should register user successfully', async () => {
      const data = UserFixtures.getUser({ hasCode: false, hasImage: false })
      const userCreateSpy = jest.spyOn(userMock, 'create')
      const addUserProm = userService.registerUser(data)
      await expect(addUserProm).resolves.toBeInstanceOf(userMock.Instance)
      expect(userCreateSpy.mock.calls).toHaveLength(1)
    })
  })
})
