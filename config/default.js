const Path = require('path')

const LogLevels = require('../constants/log-levels')
const StorageProviderEnums = require('../lib/storage/storage-provider-enums')

const localUploadsFolder = '/local-storage'

module.exports = {
  App: {
    BaseURL: process.env.BASE_URL || 'http://localhost:3030',
    Port: process.env.PORT || 3030,
    SaltRounds: 3,
    BodyParser: {
      formLimit: '10mb',
      jsonLimit: '10mb',
      queryString: {
        allowDots: true,
        parameterLimit: Infinity
      }
    },

    MigrationDir: Path.resolve(__dirname, '../migrations'),
    ModelsDir: Path.resolve(__dirname, '../modules/*/models'),
    RoutesDir: Path.resolve(__dirname, '../{modules,shared}/**/routes')
  },
  Db: {
    url: 'sqlite:db.sqlite',
    dialect: 'sqlite',
    benchmark: true,
    retry: {
      max: 3
    }
  },
  Logger: {
    Filename: Path.resolve(__dirname, '../logs/%DATE%.log'),
    Level: LogLevels.DEBUG,
    EnableFileLogger: false,
    MaxSize: '10m',
    MaxFiles: 20,
    MaxLengthFieldVal: 100
  },
  DbLogger: {
    Enabled: true,
    StatementsSkipEnabled: true,
    ShortenSelect: true,
    StatementsMaxLength: 2000
  },
  Jwt: {
    Secret: '69mseih7FYdmHp5h7y1L',
    AccessTokenExpiry: '10s', // 10 seconds for demonstration purposes
    RefreshTokenExpiry: '100d'
  },
  Assets: {
    MaxAge: 30 * 24 * 60 * 60 * 1000,
    ProductImagesDirName: 'products'
  },
  StorageProvider: {
    Default: StorageProviderEnums.Local,
    LocalUploadsFolder: localUploadsFolder,
    LocalUploadsDir: Path.resolve(__dirname, `../public/${localUploadsFolder}`)
  },
  Jest: {
    Timeout: 60000
  }
}
