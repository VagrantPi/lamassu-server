const gql = require('graphql-tag')

const typeDef = gql`
  type Mutation {
    createPairingTotem(name: String!): String @auth
  }
`

module.exports = typeDef
