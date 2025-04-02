const gql = require('graphql-tag')

const typeDef = gql`
  type Query {
    getMarkets: JSONObject @auth
  }
`

module.exports = typeDef
