'use strict'

const { toUpperSnake, toUpperCamel } = require('@northscaler/string-support')

/**
 * Formats an error message.
 *
 * @param {string} code The error code.
 * @param {string} [msg] The error message.
 * @param {Error} [cause] The error's cause.
 * @return {string} The formatted error message.
 */
function message (code, msg, cause) {
  let m = code
  if (msg) m += `: ${msg}`
  if (cause?.message) m += `: ${cause?.message}`

  return m
}

/**
 * A base error class.
 */
class CodedError extends Error {
  /**
   * Constructs a new instance of this class.
   *
   * @param {Error} [cause] An optional cause of this error.
   * @param {string} [msg] An optional message.
   * @param {*} [info] An optional value of any kind.
   * @param {string} [_n]  A name for instances of this class.
   * @param {string} [_c] A code for instances of this class.
   */
  constructor ({ cause, msg, info, _n, _c } = {}) {
    super(message(_c, msg, cause))

    this.name = _n
    this.code = _c
    this.cause = cause
    this.info = info
  }
}

/**
 * Defines a new error class.
 *
 * @param {string} [name]  A name for instances of this class
 * @param {string} [code] A code for instances of this class
 * @param {*} [supererror] An optional superclass previously returned by this function.
 */
const defineErrorClass = ({ code, name, supererror }) => {
  if (!name && !code) throw new Error('name or code is required')
  if (name && !code) code = `E_${toUpperSnake(name)}`.replace(/_ERROR$/, '')
  if (code && !name) {
    name = toUpperCamel(code.replace(/^E_/, ''))
    if (!name.endsWith('Error')) name = `${name}Error`
  }

  const C = {
    [name]: class extends (supererror || CodedError) {
      static isInstance (it) {
      // if (it instanceof C) return true
        if (!it) return it
        if (it.name === name) return true

        let proto = it.constructor
        while (proto && proto.name !== 'CodedError') {
          if (proto.name === name) return true
          proto = Object.getPrototypeOf(proto)
        }

        return false
      }

      /**
     * Constructs a new instance of this class.
     *
     * @param {Error} [cause] An optional cause of this error.
     * @param {string} [msg] An optional message.
     * @param {*} [info] An optional value of any kind.
     * @param {string} [_n] An optional name for instances of this class; defaults to {@param _c}.
     * @param {string} [_c] An optional code for instances of this class; defaults to the code value when the class was defined.
     */
      constructor ({ cause, msg, info, _n, _c } = {}) {
        if (typeof arguments[0] === 'string') {
          msg = arguments[0]
        }
        _c = _c || code
        _n = _n || name || _c
        super({ cause, msg, info, _c, _n })
        this.message = message(_c, msg, cause)
      }
    }
  }[name] // causes name of class to be value of name

  /**
   * The symbolic error code of the class.
   *
   * @type {string}
   */
  C.CODE = code

  C.subclass = ({ code, name }) => defineErrorClass({ code, name, supererror: C })

  return C
}

module.exports = defineErrorClass
