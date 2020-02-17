'use strict'

const IllegalArgumentError = require('./IllegalArgumentError')

/**
 * Error class indicating that the type of the argument given is illegal.
 */
const E = IllegalArgumentError.subclass({ name: 'IllegalArgumentTypeError' })

module.exports = E
