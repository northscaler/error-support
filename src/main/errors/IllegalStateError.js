'use strict'

const CodedError = require('./CodedError')

/**
 * Error class indicating that something is in an illegal state.
 */
const E = CodedError({ name: 'IllegalStateError' })

module.exports = E
