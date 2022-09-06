const { ForbiddenError } = require('../../../lib/errors')

module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return (ctx, next) => {
    if (roles.length && !roles.includes(ctx.state.user.Role)) {
      throw new ForbiddenError('User not authorized!')
    }

    // Authorization success
    return next()
  }
}
