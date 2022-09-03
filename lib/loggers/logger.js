const Winston = require('winston')
require('winston-daily-rotate-file')
const Util = require('util')
const _ = require('lodash')
const Config = require('config')
const ReqTracer = require('cls-rtracer')

const ColorReset = '\x1b[0m'

class AppLogger {
  static transports = []

  static getTransports (label, loggerCfg) {
    // eslint-disable-next-line new-cap
    const transports = this.transports

    transports.push(new Winston.transports.Console({
      format: AppLogger.getFormat(label, true)
    }))

    if (loggerCfg.EnableFileLogger) {
      const { Filename, MaxSize, MaxFiles } = loggerCfg
      transports.push(new (Winston.transports.DailyRotateFile)({
        filename: Filename,
        maxSize: MaxSize,
        maxFiles: MaxFiles,
        format: AppLogger.getFormat(label, false)
      }))
    }

    return transports
  }

  static getLogger (name, level, opts) {
    const loggerCfg = Config.get('Logger')
    const [, levelStr, customLevel] = level || loggerCfg.Level
    const winstonLevel = (customLevel || levelStr).toLowerCase()
    return AppLogger.createLogger(winstonLevel, AppLogger.getTransports(name, loggerCfg, opts))
  }

  static createLogger (levelStr, transports) {
    const winstonLogger = Winston.createLogger({
      level: levelStr,
      transports
    })

    const flush = () => {
      const prom = new Promise(resolve => winstonLogger.on('finish', resolve))
      winstonLogger.end()
      return prom
    }

    const winstonLevelMap = { error: 'e', debug: 'd', info: 'i', warn: 'w', silly: 't' }
    return _.reduce(winstonLevelMap, (acc, appLevel, winstonLevel) => {
      return {
        ...acc,
        [appLevel]: (...args) => {
          const message = args.map(singleArg => _.isObject(singleArg) && !singleArg.customLog
            ? Util.inspect(singleArg, { depth: 2 })
            : singleArg)

          winstonLogger.log({ level: winstonLevel, message })
        }
      }
    }, { flush })
  }

  static getFormat (label, colorEnabled) {
    const formatMessage = params => {
      let splat = ''

      const lastMsg = _.last(params.message)
      let messages = params.message
      if (lastMsg && lastMsg.customLog && lastMsg.customLog.color) {
        const coloredText = lastMsg.customLog
        splat = colorEnabled
          ? `${coloredText.color}${coloredText.text}${ColorReset}`
          : coloredText.text

        messages = params.message.slice(0, params.message.length - 1)
      }

      const reqId = ReqTracer.id() || 'Main-Process'
      return `${params.timestamp} ${reqId} ${params.level} ${params.label}: ${messages
        .join(' ')} ${splat}`
    }

    const format = info => formatMessage(info)
    const { combine, timestamp, label: winstonLabel, printf, colorize } = Winston.format
    return combine(
      winstonLabel({ label }),
      timestamp(),
      printf(format),
      colorize({ all: colorEnabled })
    )
  }
}

module.exports = {
  get: (name, level, opts = { }) => AppLogger.getLogger(name, level, opts)
}
