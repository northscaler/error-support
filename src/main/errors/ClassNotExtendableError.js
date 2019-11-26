'use strict'

const IllegalStateError = require('./IllegalStateError')

module.exports = IllegalStateError.subclass({ name: 'ClassNotExtendableError' })
