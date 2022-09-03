const config = require('config').get('DbLogger')

const log = require('./logger').get('Db')

const slow = 10
const verySlow = 100

const White = '\x1b[0m'
const Yellow = '\x1b[33m'
const Red = '\x1b[31m'

function colorQueryTime (time) {
  let color = White

  if (time > slow) color = Yellow
  else if (time > verySlow) color = Red
  return color
}

function shortenStatement (statement, time) {
  if (statement.length > config.StatementsMaxLength && config.ShortenSelect) {
    const l = config.StatementsMaxLength / 2
    statement = statement.substr(0, l) + '... ...' + statement.substr(statement.length - 1 - l)
  }

  if (time > slow) return statement
  if (config.ShortenSelect) statement = statement.replace(/SELECT.*WHERE/, 'SELECT ... WHERE')
  return statement
}

const skipStatementList = [
  'CREATE TABLE IF NOT EXISTS',
  'PRAGMA INDEX_LIST',
  'INDEX_INFO',
  'IS NULL CREATE TABLE',
  'EXEC sys.sp_helpindex'
]

module.exports = (statement, time) => {
  const replacedStatement = statement
    .replace(/{"type":"Buffer","data":\[.*]}/gi, '{"type":"Buffer","data":[...]}')

  if (!config.Enabled) return
  if (config.StatementsSkipEnabled && skipStatementList
    .find(skipStatement => statement.includes(skipStatement))) {
    return
  }

  log.d(shortenStatement(replacedStatement, time)
    , { customLog: { text: `(${time})ms`, color: colorQueryTime(time) } })
}
