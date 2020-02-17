'use strict'

const CodedError = require('./CodedError')

/**
 * Error class indicating that something has already been initialized.
 * @typedef {object} AlreadyInitializedError
 * @extends CodedError
 */
const E = CodedError({ name: 'AlreadyInitializedError' })

module.exports = E
