const { DateTimeISOResolver, JSONResolver, JSONObjectResolver } = require('graphql-scalars')

const resolvers = {
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
  DateTimeISO: DateTimeISOResolver
}

module.exports = resolvers
