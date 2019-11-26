'use strict'

const IllegalArgumentError = require('./IllegalArgumentError')

module.exports = IllegalArgumentError.subclass({ name: 'IllegalArgumentTypeError' })
