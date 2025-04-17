const DataLoader = require('dataloader')

const loyalty = require('../../../loyalty')
const { getSlimCustomerByIdBatch } = require('../../../customers')

const customerLoader = new DataLoader(ids => {
  return getSlimCustomerByIdBatch(ids)
}, { cache: false })

const resolvers = {
  IndividualDiscount: {
    customer: parent => customerLoader.load(parent.customerId)
  },
  Query: {
    promoCodes: () => loyalty.getAvailablePromoCodes(),
    individualDiscounts: () => loyalty.getAvailableIndividualDiscounts()
  },
  Mutation: {
    createPromoCode: (...[, { code, discount }]) => loyalty.createPromoCode(code, discount),
    deletePromoCode: (...[, { codeId }]) => loyalty.deletePromoCode(codeId),
    createIndividualDiscount: (...[, { customerId, discount }]) => loyalty.createIndividualDiscount(customerId, discount),
    deleteIndividualDiscount: (...[, { discountId }]) => loyalty.deleteIndividualDiscount(discountId)
  }
}

module.exports = resolvers
