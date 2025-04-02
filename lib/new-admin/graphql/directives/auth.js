const _ = require('lodash/fp')
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils')
const { defaultFieldResolver } = require('graphql')

const { AuthenticationError } = require('../errors')

function authDirectiveTransformer(schema, directiveName = 'auth') {
  return mapSchema(schema, {
    // For object types
    [MapperKind.OBJECT_TYPE]: (objectType) => {
      const directive = getDirective(schema, objectType, directiveName)?.[0]
      if (directive) {
        const requiredAuthRole = directive.requires
        objectType._requiredAuthRole = requiredAuthRole
      }
      return objectType
    },
    
    // For field definitions
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0]
      if (directive) {
        const requiredAuthRole = directive.requires
        fieldConfig._requiredAuthRole = requiredAuthRole
      }
      
      // Get the parent object type
      const objectType = schema.getType(typeName)
      
      // Apply auth check to the field's resolver
      const { resolve = defaultFieldResolver } = fieldConfig
      fieldConfig.resolve = function (root, args, context, info) {
        const requiredRoles = fieldConfig._requiredAuthRole || objectType._requiredAuthRole
        if (!requiredRoles) return resolve.apply(this, [root, args, context, info])
        
        const user = context.req.session.user
        if (!user || !_.includes(_.upperCase(user.role), requiredRoles)) {
          throw new AuthenticationError('You do not have permission to access this resource!')
        }
        
        return resolve.apply(this, [root, args, context, info])
      }
      
      return fieldConfig
    }
  })
}

module.exports = authDirectiveTransformer
