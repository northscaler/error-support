'use strict'

const IllegalArgumentError = require('./IllegalArgumentError')

/**
 * Error class indicating that a required argument is missing.
 */
const E = IllegalArgumentError.subclass({ name: 'MissingRequiredArgumentError' })

module.exports = E
