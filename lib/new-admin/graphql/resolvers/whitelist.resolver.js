const whitelist = require('../../../whitelist')

const resolvers = {
  Query: {
    whitelist: () => whitelist.getWhitelist()
  },
  Mutation: {
    deleteWhitelistRow: (...[, { cryptoCode, address }]) =>
      whitelist.deleteFromWhitelist(cryptoCode, address),
    insertWhitelistRow: (...[, { cryptoCode, address }]) =>
      whitelist.insertIntoWhitelist(cryptoCode, address)
  }
}

module.exports = resolvers
