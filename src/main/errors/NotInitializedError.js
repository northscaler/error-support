'use strict'

const CodedError = require('./CodedError')

/**
 * Error class indicating that something wasn't initialized yet.
 * This is usually the case when instantiating a class is insufficient to prepare it for use, and requires some initialization method to be called.
 */
const E = CodedError({ name: 'NotInitializedError' })

module.exports = E
