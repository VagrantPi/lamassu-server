const gql = require('graphql-tag')

const typeDef = gql`
  type IndividualDiscount {
    id: ID!
    customer: DiscountCustomer!
    discount: Int
  }
  
  type DiscountCustomer {
    id: ID!
    phone: String
    idCardData: JSONObject
  }

  type PromoCode {
    id: ID!
    code: String!
    discount: Int
  }

  type Query {
    promoCodes: [PromoCode] @auth
    individualDiscounts: [IndividualDiscount] @auth
  }

  type Mutation {
    createPromoCode(code: String!, discount: Int!): PromoCode @auth
    deletePromoCode(codeId: ID!): PromoCode @auth
    createIndividualDiscount(customerId: ID!, discount: Int!): IndividualDiscount @auth
    deleteIndividualDiscount(discountId: ID!): IndividualDiscount @auth
  }
`

module.exports = typeDef
