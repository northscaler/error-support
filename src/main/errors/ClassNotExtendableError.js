'use strict'

const IllegalStateError = require('./IllegalStateError')

/**
 * Error class indicating that a class cannot be extended.
 * @typedef {object} IllegalStateError
 * @extends CodedError
 */
const E = IllegalStateError.subclass({ name: 'IllegalStateError' })

module.exports = E
