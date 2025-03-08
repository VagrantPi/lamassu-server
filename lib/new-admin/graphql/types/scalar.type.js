const gql = require('graphql-tag')

const typeDef = gql`
  scalar JSON
  scalar JSONObject
  scalar Date
  scalar Upload
`

module.exports = typeDef
