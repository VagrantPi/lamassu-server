const gql = require('graphql-tag')

const typeDef = gql`
  type Customer {
    id: ID!
    authorizedOverride: String
    daysSuspended: Int
    isSuspended: Boolean
    newPhoto: Upload
    photoType: String
    frontCameraPath: String
    frontCameraAt: DateTimeISO
    frontCameraOverride: String
    phone: String
    email: String
    isAnonymous: Boolean
    smsOverride: String
    idCardData: JSONObject
    idCardDataOverride: String
    idCardDataExpiration: DateTimeISO
    idCardPhoto: Upload
    idCardPhotoPath: String
    idCardPhotoOverride: String
    idCardPhotoAt: DateTimeISO
    usSsn: String
    usSsnOverride: String
    sanctions: Boolean
    sanctionsAt: DateTimeISO
    sanctionsOverride: String
    totalTxs: Int
    totalSpent: String
    lastActive: DateTimeISO
    lastTxFiat: String
    lastTxFiatCode: String
    lastTxClass: String
    lastUsedMachine: String
    lastUsedMachineName: String
    transactions: [Transaction]
    subscriberInfo: JSONObject
    phoneOverride: String
    customFields: [CustomerCustomField]
    customInfoRequests: [CustomRequestData]
    notes: [CustomerNote]
    isTestCustomer: Boolean
    externalCompliance: [JSONObject]
  }

  input CustomerInput {
    authorizedOverride: String
    frontCameraPath: String
    frontCameraOverride: String
    phone: String
    smsOverride: String
    idCardData: JSONObject
    idCardDataOverride: String
    idCardDataExpiration: DateTimeISO
    idCardPhotoPath: String
    idCardPhotoOverride: String
    usSsn: String
    usSsnOverride: String
    sanctions: Boolean
    sanctionsAt: DateTimeISO
    sanctionsOverride: String
    totalTxs: Int
    totalSpent: String
    lastActive: DateTimeISO
    lastTxFiat: String
    lastTxFiatCode: String
    lastTxClass: String
    suspendedUntil: DateTimeISO
    subscriberInfo: Boolean
    phoneOverride: String
  }

  input CustomerEdit {
    idCardData: JSONObject
    idCardPhoto: Upload
    usSsn: String
    subscriberInfo: JSONObject
  }

  type CustomerNote {
    id: ID
    customerId: ID
    created: DateTimeISO
    lastEditedAt: DateTimeISO
    lastEditedBy: ID
    title: String
    content: String
  }

  type CustomerCustomField {
    id: ID
    label: String
    value: String
  }

  type Query {
    customers(phone: String, name: String, email: String, address: String, id: String): [Customer] @auth
    customer(customerId: ID!): Customer @auth
    customerFilters: [Filter] @auth
  }

  type Mutation {
    setCustomer(customerId: ID!, customerInput: CustomerInput): Customer @auth
    addCustomField(customerId: ID!, label: String!, value: String!): Boolean @auth
    saveCustomField(customerId: ID!, fieldId: ID!, value: String!): Boolean @auth
    removeCustomField(customerId: ID!, fieldId: ID!): Boolean @auth
    editCustomer(customerId: ID!, customerEdit: CustomerEdit): Customer @auth
    deleteEditedData(customerId: ID!, customerEdit: CustomerEdit): Customer @auth
    replacePhoto(customerId: ID!, photoType: String, newPhoto: Upload): Customer @auth
    createCustomerNote(customerId: ID!, title: String!, content: String!): Boolean @auth
    editCustomerNote(noteId: ID!, newContent: String!): Boolean @auth
    deleteCustomerNote(noteId: ID!): Boolean @auth
    createCustomer(phoneNumber: String): Customer @auth
    enableTestCustomer(customerId: ID!): Boolean @auth
    disableTestCustomer(customerId: ID!): Boolean @auth
  }
`

module.exports = typeDef
