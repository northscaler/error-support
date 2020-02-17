'use strict'

const CodedError = require('./CodedError')

/**
 * Error class indicating that a method that is intended to be abstract has not been implemented.
 * JavaScript doesn't support abstract methods, so the alternative is to declare the method with an implementation that simply throws an instance of this error.
 */
const E = CodedError({ name: 'MethodNotImplementedError' })

module.exports = E
