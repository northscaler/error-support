'use strict'

const { toUpperSnake, toUpperCamel } = require('../string-utils')

/**
 * A base error class that has a `cause` property, forming a chain of `Error`s, as well as convenient message & object formatting.
 */
class CodedError extends Error {
  /**
   * The code to use in a message when there is no code.
   * @type {string}
   */
  static NO_CODE = 'NO_CODE'

  /**
   * The message string to use when there is no message.
   * @type {string}
   */
  static NO_MESSAGE = 'NO_MESSAGE'

  /**
   * The value to use when omitting a value.
   * @type {null}
   */
  static OMISSION = null

  /**
   * Formats an error message suitable for the `Error` constructor.
   * Always includes information from available `message`, `code` properties recursively through `cause`.
   * Though not prevented or removed, callers are discouraged from using newlines or carriage returns in `message` text.
   *
   * @param {object} [arg0={}] The argument to be deconstructed.
   * @param {string|number} [arg0.code=undefined] The error code; if falsey, then {@link CodedError.NO_CODE} is used.
   * @param {string} [arg0.message=undefined] The error message.
   * @param {*} [arg0.cause=undefined] The error's cause.
   * @return {string} The formatted error message.
   */
  static _message ({
    code,
    message,
    cause
  } = {}) {
    let m = code || CodedError.NO_CODE

    m += `: ${message || CodedError.NO_MESSAGE}`

    if (Array.isArray(cause)) {
      m += `: [${cause
        .map(it => it instanceof Error ? it?.message || CodedError.NO_MESSAGE : it)
        .filter(it => it !== null && it !== undefined)
        .join(', ')
      }]`
    } else {
      m += cause
        ? `: ${cause instanceof Error ? (cause?.message || CodedError.NO_MESSAGE) : cause}`
        : ''
    }

    return m
  }

  /**
   * If the given `key` is not omitted, sets `on[key]` to the value of `from[key]`.
   * If the given `key` _is_ omitted, set `on[key]` to `null`.
   *
   * @param {object} arg0 The argument to be deconstructed.
   * @param {string[]} omitting The normalized array of property names being omitted.
   * @param {object} on The target object whose properties are being set or omitted.
   * @param {object} from The source object whose properties are being set or ommitted on `target`.
   * @param {string} key The key being set or omitted on `target` from `from`.
   * @return The value given in `on`.
   * @private
   */
  static _setOrOmit ({
    omitting,
    on,
    from,
    key
  }) {
    on[key] = omitting.includes(key) ? CodedError.OMISSION : from[key]
    return on
  }

  /**
   * Safely returns the given item as a plain object or primitive type with special consideration for {@link CodedError}s & `Error`s.
   *
   * * If `item` is `null` or `undefined`, returns the item.
   * * If `item` satisfies `typeof item !== 'object'`, returns the item.
   * * If `item` is an `Array`, returns an `Array` with its elements passed to this method.
   * * If `item` is a {@link CodedError} or `Error`, returns the item using {@link CodedError#toObject} or as a literal object, respectively.
   * * Otherwise, the item's keys are enumerated (via `Object.keys(item)`) and passed to this method recursively; the return value becomes the value at that key.
   *
   * @param {object} [arg0={}] The argument to be deconstructed.
   * @param {*} [arg0.item=undefined] The item to convert.
   * @param {string|string[]|boolean} [arg0.omitting=[]] The property names to omit recursively during (@link CodedError#toObject}.
   * If a `boolean`, whether to omit `stack` if `true`, or include `stack` if `false.
   * If a property is omitted, its value is explicitly set to `null`, as apposed to `undefined`, in an effort to communicate that it was present but actively omitted.
   * @return {object}
   * @private
   */
  static _anyToObject ({
    item,
    omitting = 'stack'
  } = {}) {
    if (item === undefined || item === null) return item

    if (typeof item !== 'object') return item

    if (Array.isArray(item)) return item.map(it => CodedError._anyToObject({ item: it, omitting }))

    if (item instanceof CodedError) return item.toObject({ omitting })

    omitting = CodedError._normalizeOmitting(omitting)

    if (item instanceof Error) {
      return ['message', 'name', 'stack']
        .reduce((accum, key) => CodedError._setOrOmit({ omitting, on: accum, from: item, key }), {})
    }

    return Object.keys(item)
      .reduce((accum, key) => {
        accum[key] = omitting.includes(key)
          ? CodedError.OMISSION
          : CodedError._anyToObject({ item: item[key], omitting })
        return accum
      }, {})
  }

  /**
   * Safely normalizes the array of property names to be omitted during (@link CodedError#toObject} and (@link CodedError._anyToObject}.
   * Any non-string elements are silently ignored.
   *
   * @param {string|string[]|boolean} [omitting=[]] The property names to omit recursively during (@link CodedError#toObject}.
   * If a `boolean`, whether to omit `stack` if `true`, or include `stack` if `false.
   * If a property is omitted, its value is explicitly set to `null`, as apposed to `undefined`, in an effort to communicate that it was present but actively omitted.
   * @return {string[]} An array of strings.
   * @private
   */
  static _normalizeOmitting (omitting = []) {
    if (omitting === null || omitting === undefined) omitting = true
    if (typeof omitting === 'boolean') return omitting ? ['stack'] : []

    return (omitting ? Array.isArray(omitting) ? omitting : [omitting] : [])
      .reduce((accum, it) => {
        if (typeof it === 'string') accum.push(it)
        return accum
      }, [])
  }

  /**
   * Constructs a new instance of this class.
   *
   * @param {Object} arg0 The argument to be deconstructed.
   * @param {Error|Error[]} [arg0.cause] An optional cause or list of causes of this error.
   * @param {string} [arg0.msg] An optional message.
   * Though not prevented or removed, callers are discouraged from using newlines or carriage returns in `message` text.
   * @param {*} [arg0.info] An optional value of any kind.
   * @param {string} [arg0._n]  A name for instances of this class.
   * Not intended for public consumption.
   * @param {string} [arg0._c] A code for instances of this class.
   * Not intended for public consumption.
   */
  constructor ({
    cause,
    msg,
    info,
    _n,
    _c
  } = {}) {
    super(CodedError._message({ code: _c, msg, cause }))

    this.name = _n
    this.code = _c
    this.cause = cause
    this.info = info
  }

  /**
   * Safely returns this object as a plain, JavaScript object literal, suitable for use with `JSON.stringify()`, etc.
   *
   * @param {object|boolean} [arg0={}] The argument to be deconstructed, or, if a `boolean`, an indication to omit `stack` if `true`, else include `stack` if `false`.
   * @param {string|string[]|boolean} [arg0.omitting='stack'] The property names to omit recursively during (@link CodedError#toObject}.
   * If a `boolean`, whether to omit `stack` if `true`, or include `stack` if `false`.
   * If a property is omitted, its value is explicitly set to `null`, as apposed to `undefined`, in an effort to communicate that it was present but actively omitted.
   * @return {object} A plain, literal JavaScript object representation of this error.  See README.md for more information.
   */
  toObject ({
    omitting = 'stack'
  } = {}) {
    omitting = CodedError._normalizeOmitting(typeof arguments[0] === 'boolean' ? arguments[0] : omitting)

    return Object.keys(this).concat(['message', 'stack'])
      .reduce((accum, key) => {
        if (key === 'cause') { // possibly recurse here
          accum.cause = omitting.includes(key) ? CodedError.OMISSION : CodedError._anyToObject({
            item: this.cause, omitting
          })
          return accum
        }
        return CodedError._setOrOmit({ omitting, on: accum, from: this, key })
      }, {})
  }

  /**
   * Because you don't want error handling throwing or logging errors, this method attempts to `JSON.stringify` itself.
   * In the event that `JSON.stringify` throws an `Error`, a fallback JSON representation of this object is returned.
   * The fallback object includes the following keys:
   * * `error`, with the `message`, `code`, `name` & `stack` of this error (subject to `omitting`), and
   * * `jsonStringifyError`, with the same properties as above except from the `JSON.stringify` error.
   *
   * @param {object} [arg0=undefined] The argument to be deconstructed.
   * @param {string|string[]|boolean} [arg0.omitting='stack'] The property names to omit recursively during (@link CodedError#toObject}.
   * If a `boolean`, whether to omit `stack` if `true`, or include `stack` if `false.
   * If a property is omitted, its value is explicitly set to `null`, as apposed to `undefined`, in an effort to communicate that it was present but actively omitted.
   * @param {function} [arg0.replacer] The [`toJSON` replacer function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) to use.
   * @param {number} [arg0.spaces] The number of spaces to use for indentation.
   * @return {string}
   */
  toJson ({
    omitting = 'stack',
    replacer,
    spaces
  } = {}) {
    try {
      return JSON.stringify(this.toObject({ omitting }), replacer, spaces)
    } catch (e) {
      const fallback = { jsonStringifyError: {}, error: {} }

      omitting = CodedError._normalizeOmitting(omitting);

      ['message', 'code', 'name', 'stack'].forEach(key => {
        ['jsonStringifyError', 'error'].forEach(prop => {
          fallback[prop][key] = omitting.includes(key) ? null : (prop === 'error' ? this : e)[key]
        })
      })

      return JSON.stringify(fallback, null, spaces)
    }
  }
}

/**
 * Derives a code & name if necessary from the given code & name.
 * @param code
 * @param name
 * @return {{code: string, name: string}}
 * @private
 */
function _determineCodeAndName ({ code, name }) {
  if (!name && !code) throw new Error('name or code is required')

  if (name && !code) code = `E_${toUpperSnake(name)}`.replace(/_ERROR$/, '')

  if (code && !name) {
    name = toUpperCamel(code.replace(/^E_/, ''))
    if (!name.endsWith('Error')) name = `${name}Error`
  }

  return { code, name }
}

/**
 * Defines a new error class.
 *
 * @param {Object} arg0 The argument to be deconstructed.
 * @param {string} [arg0.name]  A name for instances of this class.
 * This argument must be present if `arg0.code` is missing, and the code becomes the upper-cased snake format of the name.
 * For example, passing the name `SomethingWickedError` causes the `code` to be `E_SOMETHING_WICKED`.
 * @param {string} [arg0.code] A code for instances of this class
 * This argument must be present if `arg0.name` is missing.
 * For example, passing the code `E_SOMETHING_WICKED` causes the `name` to be `SomethingWickedError`.
 * @param {*} [arg0.supererror] An optional superclass previously returned by this function.
 */
const defineErrorClass = ({
  code,
  name,
  supererror
}) => {
  const codename = _determineCodeAndName({ code, name })
  code = codename.code
  name = codename.name

  const C = {
    [name]: class extends (supererror || CodedError) {
      /**
       * Constructs a new instance of this class.
       *
       * @param {Object} [args0] The argument to be deconstructed.
       * @param {Error} [args0.cause] An optional cause of this error.
       * @param {string} [args0.message] An optional message.
       * If both `message` and `msg` are provided, `message` takes precedence.
       * @param {string} [args0.msg] Deprecated; use `message`.
       * If both `message` and `msg` are provided, `message` takes precedence.
       * @param {*} [args0.info] An optional value of any kind.
       * @param {string} [args0._n] An optional name for instances of this class; defaults to {@param _c}.
       * @param {string} [args0._c] An optional code for instances of this class; defaults to the code value when the class was defined.
       */
      constructor ({
        cause,
        message,
        info,
        _n,
        _c,
        msg
      } = {}) {
        if (typeof arguments[0] === 'string') message = arguments[0]
        if (!message) message = msg

        _c = _c || code
        _n = _n || name || _c
        super({ cause, message, info, _c, _n })
        this.message = CodedError._message({ code: _c, message, cause })
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
