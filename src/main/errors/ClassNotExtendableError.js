'use strict'

const IllegalStateError = require('./IllegalStateError')

/**
 * Error class indicating that a class cannot be extended.
 * @type ClassNotExtendableError
 */
const E = IllegalStateError.subclass({ name: 'ClassNotExtendableError' })

module.exports = E
