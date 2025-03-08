const logger = require('../logger')

const { ApolloServer } = require('@apollo/server')

const devMode = !!require('minimist')(process.argv.slice(2)).dev

const context = ({ req, res }) => ({
  deviceId: req.deviceId, /* lib/middlewares/populateDeviceId.js */
  deviceName: req.deviceName, /* lib/middlewares/authorize.js */
  operatorId: res.locals.operatorId, /* lib/middlewares/operatorId.js */
  pid: req.query.pid,
  settings: req.settings, /* lib/middlewares/populateSettings.js */
})

const graphQLServer = new ApolloServer({
  typeDefs: require('./types'),
  resolvers: require('./resolvers'),
  introspection: false,
  formatError: error => {
    logger.error(error)
    return error
  },
  includeStacktraceInErrorResponses: devMode,
  logger
})

module.exports = { graphQLServer, context }