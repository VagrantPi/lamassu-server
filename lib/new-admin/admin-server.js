const fs = require('fs')
const compression = require('compression')
const path = require('path')
const express = require('express')
const https = require('https')
const serveStatic = require('serve-static')
const helmet = require('helmet')
const nocache = require('nocache')
const cookieParser = require('cookie-parser')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginLandingPageDisabled } = require('@apollo/server/plugin/disabled')
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default')

const { mergeResolvers } = require('@graphql-tools/merge')
const { makeExecutableSchema } = require('@graphql-tools/schema')

require('../environment-helper')
const { asyncLocalStorage, defaultStore } = require('../async-storage')
const logger = require('../logger')
const exchange = require('../exchange')

const { authDirectiveTransformer } = require('./graphql/directives')
const { typeDefs, resolvers } = require('./graphql/schema')
const findOperatorId = require('../middlewares/operatorId')
const computeSchema = require('../compute-schema')
const { USER_SESSIONS_CLEAR_INTERVAL } = require('../constants')
const { session, cleanUserSessions, buildApolloContext } = require('./middlewares')

const devMode = require('minimist')(process.argv.slice(2)).dev

const HOSTNAME = process.env.HOSTNAME
const KEY_PATH = process.env.KEY_PATH
const CERT_PATH = process.env.CERT_PATH
const CA_PATH = process.env.CA_PATH
const ID_PHOTO_CARD_DIR = process.env.ID_PHOTO_CARD_DIR
const FRONT_CAMERA_DIR = process.env.FRONT_CAMERA_DIR
const OPERATOR_DATA_DIR = process.env.OPERATOR_DATA_DIR

if (!HOSTNAME) {
  logger.error('No hostname specified.')
  process.exit(1)
}

const loadRoutes = async () => {
  const app = express()

  app.use(helmet())
  app.use(compression())
  app.use(nocache())
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true })) // support encoded bodies
  app.use(express.static(path.resolve(__dirname, '..', '..', 'public')))
  app.use(cleanUserSessions(USER_SESSIONS_CLEAR_INTERVAL))
  app.use(computeSchema)
  app.use(findOperatorId)
  app.use(session)

  // Dynamic import for graphql-upload since it's not a CommonJS module
  const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.mjs')
  const { default: GraphQLUpload } = await import('graphql-upload/GraphQLUpload.mjs')

  app.use(graphqlUploadExpress())

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: mergeResolvers(resolvers, { Upload: GraphQLUpload }),
  })
  const schemaWithDirectives = authDirectiveTransformer(schema)

  const apolloServer = new ApolloServer({
    schema: schemaWithDirectives,
    csrfPrevention: false,
    introspection: false,
    formatError: (formattedError, error) => {
      logger.error(error, JSON.stringify(error?.extensions || {}))
      return formattedError
    },
    plugins: [
      devMode 
        ? ApolloServerPluginLandingPageLocalDefault() 
        : ApolloServerPluginLandingPageDisabled()
    ]
  })

  await apolloServer.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => buildApolloContext({ req, res })
    })
  );


  app.use('/id-card-photo', serveStatic(ID_PHOTO_CARD_DIR, { index: false }))
  app.use('/front-camera-photo', serveStatic(FRONT_CAMERA_DIR, { index: false }))
  app.use('/operator-data', serveStatic(OPERATOR_DATA_DIR, { index: false }))

  // Everything not on graphql or api/register is redirected to the front-end
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html')))

  return app
}

const certOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
  ca: fs.readFileSync(CA_PATH)
}

function run () {
  const store = defaultStore()
  asyncLocalStorage.run(store, async () => {
    const app = await loadRoutes()
    const serverPort = devMode ? 8070 : 443

    const serverLog = `lamassu-admin-server listening on port ${serverPort}`

    // cache markets on startup
    exchange.getMarkets().catch(console.error)

    const webServer = https.createServer(certOptions, app)
    webServer.listen(serverPort, () => logger.info(serverLog))
  })
}

module.exports = { run }
