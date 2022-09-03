const Config = require('config')

jest.setTimeout(Config.get('Jest.Timeout'))
