'use strict'

const CodedError = require('./CodedError')

/**
 * Error class indicating that an illegal argument has been passed.
 * @typedef {object} IllegalArgumentError
 * @extends CodedError
 */
const E = CodedError({ name: 'IllegalArgumentError' })

module.exports = E
