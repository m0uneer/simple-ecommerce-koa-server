const Request = require('supertest')
const async = require('async')
const _ = require('lodash')
const enableDestroy = require('server-destroy')

const App = require('../app')
const DbLoader = require('./models/db-loader')
const UserUrls = require('../modules/user/constants/urls')
const UserFixtures = require('../modules/user/fixtures/user-fixtures')
const RouteLoader = require('./routes/route-loader')

const userFixture = UserFixtures.getUser()
let server, singedInProm, accessToken

module.exports = class TestUtils {
  static url (...params) {
    return RouteLoader.getRoutes().router.url(...params)
  }

  /**
   * @desc create new user and sign in if not already signed in
   * @returns {Promise<object>}
   */
  static signIn (user = userFixture) {
    if (singedInProm) return singedInProm
    async function authenticate () {
      if (!server) {
        server = await App.startServer()
        enableDestroy(server)
      }

      const authenticatedRequest = Request.agent(server)
      await authenticatedRequest.post(TestUtils.url(UserUrls.postRegisterUser)).send(user)

      const res = await authenticatedRequest
        .set('Authorization', `Bearer ${accessToken}`)
        .post(TestUtils.url(UserUrls.postLoginUser))
        .send({
          email: user.email,
          password: user.password
        })

      accessToken = res.body.data.accessToken

      return authenticatedRequest
    }

    singedInProm = authenticate()
    return singedInProm
  }

  /**
   * @description Send Authenticated GET or POST Request
   * @param {object} request - information about request
   * @param {string} request.url - end point where to send the request
   * @param {object} request.params - request params
   * @param {object} request.body - request body
   * @param {string} request.method - request method POST or GET by default is POST Request
   * @returns {Promise<object>}
   */
  static async sendRequest ({ url, params = { }, body, method = 'post' }) {
    const singedIn = await this.signIn()
    const apiUrl = this.url(url, params)
    if (method === 'get') return singedIn.get(apiUrl).set('Authorization', `Bearer ${accessToken}`)
    return singedIn.post(apiUrl).set('Authorization', `Bearer ${accessToken}`).send(body)
  }

  static sendReqWithFiles (reqIns, { data, files }) {
    reqIns.set('Authorization', `Bearer ${accessToken}`)
    const formattedData = this.buildFormData(data, {}, '')
    _.map(formattedData, (v, k) => reqIns.field(k, v))
    _.map(files, (v, k) => reqIns.attach(k, v))
    return reqIns
  }

  static buildFormData (data, formData = {}, key) {
    if (!_.isPlainObject(data) || !_.isObject(data)) {
      formData[key] = _.isNil(data) ? '' : data
      return formData
    }

    Object.keys(data).forEach(childKey => {
      this.buildFormData(data[childKey], formData, key ? `${key}[${childKey}]` : childKey)
    })

    return formData
  }

  static async afterTest () {
    await DbLoader.close()
    if (server) await server.destroy()
  }

  static destroyTableList (tblList, opts = {}) {
    return async.mapLimit(tblList, 1,

      // eslint-disable-next-line require-await
      async model => model.destroy({ where: {}, ...opts, force: true }))
  }
}
