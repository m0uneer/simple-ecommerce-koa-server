const RouteLoader = require('../../../lib/routes/route-loader')
const UserUrls = require('../constants/urls')

module.exports = class AuthenticatedUrls {
  static getGuestRoutes () {
    const routes = RouteLoader.getRoutes()
    return [
      routes.router.url(UserUrls.postLoginUser),
      routes.router.url(UserUrls.postRegisterUser)
    ]
  }
}
