const { GraphQLError } = require('graphql')
const { ApolloServerErrorCode } = require('@apollo/server/errors')

class AuthenticationError extends GraphQLError {
  constructor() {
    super('Authentication failed', {
      extensions: {
        code: 'UNAUTHENTICATED'
      }
    })
  }
}

class InvalidCredentialsError extends GraphQLError {
  constructor() {
    super('Invalid credentials', {
      extensions: {
        code: 'INVALID_CREDENTIALS'
      }
    })
  }
}

class UserAlreadyExistsError extends GraphQLError {
  constructor() {
    super('User already exists', {
      extensions: {
        code: 'USER_ALREADY_EXISTS'
      }
    })
  }
}

class InvalidTwoFactorError extends GraphQLError {
  constructor() {
    super('Invalid two-factor code', {
      extensions: {
        code: 'INVALID_TWO_FACTOR_CODE'
      }
    })
  }
}

class InvalidUrlError extends GraphQLError {
  constructor() {
    super('Invalid URL token', {
      extensions: {
        code: 'INVALID_URL_TOKEN'
      }
    })
  }
}

class UserInputError extends GraphQLError {
  constructor() {
    super('User input error', {
      extensions: {
        code: ApolloServerErrorCode.BAD_USER_INPUT
      }
    })
  }
}

module.exports = {
  AuthenticationError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  InvalidTwoFactorError,
  InvalidUrlError,
  UserInputError
}