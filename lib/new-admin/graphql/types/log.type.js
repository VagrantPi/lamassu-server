const gql = require('graphql-tag')

const typeDef = gql`
  type MachineLog {
    id: ID!
    logLevel: String!
    timestamp: DateTimeISO!
    message: String!
  }

  type ServerLog {
    id: ID!
    logLevel: String!
    timestamp: DateTimeISO!
    message: String
  }

  type Query {
    machineLogs(deviceId: ID!, from: DateTimeISO, until: DateTimeISO, limit: Int, offset: Int): [MachineLog] @auth
    machineLogsCsv(deviceId: ID!, from: DateTimeISO, until: DateTimeISO, limit: Int, offset: Int, timezone: String): String @auth
    serverLogs(from: DateTimeISO, until: DateTimeISO, limit: Int, offset: Int): [ServerLog] @auth
    serverLogsCsv(from: DateTimeISO, until: DateTimeISO, limit: Int, offset: Int, timezone: String): String @auth
  }
`

module.exports = typeDef
