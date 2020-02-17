'use strict'

const CodedError = require('./CodedError')

/**
 * Error class indicating that an illegal argument has been passed.
 */
const E = CodedError({ name: 'IllegalArgumentError' })

module.exports = E
