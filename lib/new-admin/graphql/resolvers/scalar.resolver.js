const { DateTimeISOResolver, JSONResolver, JSONObjectResolver } = require('graphql-scalars')

const resolvers = {
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
  Date: DateTimeISOResolver
}

module.exports = resolvers
