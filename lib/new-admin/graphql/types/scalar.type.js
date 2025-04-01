const gql = require('graphql-tag')

const typeDef = gql`
  scalar JSON
  scalar JSONObject
  scalar DateTimeISO
  scalar Upload
`

module.exports = typeDef
