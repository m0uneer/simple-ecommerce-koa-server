module.exports = {
  App: {
    BaseURL: process.env.BASE_URL,
    Port: process.env.PORT,
    SaltRounds: Number(process.env.SALT_ROUNDS)
  },
  Db: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DATABASE_DIALECT,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  },
  Jwt: {
    Secret: process.env.JWT_SECRET,
    AccessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    RefreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY
  }
}
