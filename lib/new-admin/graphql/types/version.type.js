const gql = require('graphql-tag')

const typeDef = gql`
  type Query {
    serverVersion: String! @auth
  }
`

module.exports = typeDef
