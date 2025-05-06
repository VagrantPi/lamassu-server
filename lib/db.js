const Pgp = require('pg-promise')
const uuid = require('uuid')
const _ = require('lodash/fp')

const { PSQL_URL } = require('./constants')
const logger = require('./logger')
const eventBus = require('./event-bus')

const DATABASE_NOT_REACHABLE = 'Database not reachable.'

const pgp = Pgp({
  pgNative: true,
  schema: 'public',
  error: (err, e) => {
    if (e.cn) logger.error(DATABASE_NOT_REACHABLE)
    else if (e.query) {
      logger.error(e.query)
      e.params && logger.error(e.params)
    }
    else logger.error(err)
  }
})

const db = pgp(PSQL_URL)

eventBus.subscribe('log', args => {
  if (process.env.SKIP_SERVER_LOGS) return

  const { level, message, meta } = args

  // prevent loop if database is not reachable
  if (message === DATABASE_NOT_REACHABLE) return

  const msgToSave = message || _.get('message', meta)

  const sql = `insert into server_logs
  (id, device_id, message, log_level, meta) values ($1, $2, $3, $4, $5) returning *`
  console.log('sql', sql)

  db.one(sql, [uuid.v4(), '', msgToSave, level, meta])
    .then((t) => {
      console.log('t', t)
    })
    .then(_.mapKeys(_.camelCase))
    .catch((t) => {
      console.log('t', t)
    })
    // .catch(_.noop)
})

module.exports = db
