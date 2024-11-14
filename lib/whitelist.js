const db = require('lamassu-server/lib/db')
const notifierQueries = require('lamassu-server/lib/notifier/queries')

// Get all whitelist rows from the DB "whitelist" table that were manually inserted by the operator
const getWhitelist = () => {
  return db.any(`SELECT * FROM whitelist`).then(res =>
    res.map(item => ({
      cryptoCode: item.crypto_code,
      address: item.address
    }))
  )
}

// Delete row from whitelist table by crypto code and address
const deleteFromWhitelist = (cryptoCode, address) => {
  const sql = `DELETE FROM whitelist WHERE crypto_code = $1 AND address = $2`
  notifierQueries.clearWhitelistNotification(cryptoCode, address)
  return db.none(sql, [cryptoCode, address])
}

const insertIntoWhitelist = (cryptoCode, address) => {
  return db
    .none(
      'INSERT INTO whitelist (crypto_code, address) VALUES ($1, $2);',
      [cryptoCode, address]
    )
}

function blocked (address, cryptoCode) {
  const sql = `SELECT * FROM whitelist WHERE address = $1 AND crypto_code = $2`
  return db.any(sql, [address, cryptoCode])
}

function addToUsedAddresses (address, cryptoCode) {
  // ETH reuses addresses
  if (cryptoCode === 'ETH') return Promise.resolve()

  const sql = `INSERT INTO whitelist (crypto_code, address) VALUES ($1, $2)`
  return db.oneOrNone(sql, [cryptoCode, address])
}

module.exports = {
  blocked,
  addToUsedAddresses,
  getWhitelist,
  deleteFromWhitelist,
  insertIntoWhitelist
}
