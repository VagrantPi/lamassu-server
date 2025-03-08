const gql = require('graphql-tag')

const typeDef = gql`
  type SanctionMatches {
    ofacSanctioned: Boolean
  }

  type Query {
    checkAgainstSanctions(customerId: ID): SanctionMatches @auth
  }
`

module.exports = typeDef
