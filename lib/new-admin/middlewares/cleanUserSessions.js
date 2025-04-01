const db = require('../../db')
const { USER_SESSIONS_TABLE_NAME } = require('../../constants')
const logger = require('../../logger')

let schemaCache = Date.now()

const cleanUserSessions = (cleanInterval) => (req, res, next) => {
  const now = Date.now()

  if (schemaCache + cleanInterval > now) return next()

  logger.debug(`Clearing expired sessions for schema 'public'`)
  return db.none('DELETE FROM $1^ WHERE expire < to_timestamp($2 / 1000.0)', [USER_SESSIONS_TABLE_NAME, now])
    .then(() => {
      schemaCache = now
      return next()
    })
    .catch(next)
}

module.exports = cleanUserSessions
