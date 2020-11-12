'use strict';

const {
  toUpperSnake,
  toUpperCamel
} = require('../string-utils');
/**
 * A base error class that has a `cause` property, forming a chain of `Error`s, as well as convenient message & object formatting.
 */


class CodedError extends Error {
  /**
   * The code to use in a message when there is no code.
   * @type {string}
   */

  /**
   * The message string to use when there is no message.
   * @type {string}
   */

  /**
   * The value to use when omitting a value.
   * @type {null}
   */

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
  static _message({
    code,
    message,
    cause
  } = {}) {
    let m = code || CodedError.NO_CODE;
    m += `: ${message || CodedError.NO_MESSAGE}`;

    if (Array.isArray(cause)) {
      m += `: [${cause.map(it => it instanceof Error ? (it === null || it === void 0 ? void 0 : it.message) || CodedError.NO_MESSAGE : it).filter(it => it !== null && it !== undefined).join(', ')}]`;
    } else {
      m += cause ? `: ${cause instanceof Error ? (cause === null || cause === void 0 ? void 0 : cause.message) || CodedError.NO_MESSAGE : cause}` : '';
    }

    return m;
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


  static _setOrOmit({
    omitting,
    on,
    from,
    key
  }) {
    on[key] = omitting.includes(key) ? CodedError.OMISSION : from[key];
    return on;
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


  static _anyToObject({
    item,
    omitting = 'stack'
  } = {}) {
    if (item === undefined || item === null) return item;
    if (typeof item !== 'object') return item;
    if (Array.isArray(item)) return item.map(it => CodedError._anyToObject({
      item: it,
      omitting
    }));
    if (item instanceof CodedError) return item.toObject({
      omitting
    });
    omitting = CodedError._normalizeOmitting(omitting);

    if (item instanceof Error) {
      return ['message', 'name', 'stack'].reduce((accum, key) => CodedError._setOrOmit({
        omitting,
        on: accum,
        from: item,
        key
      }), {});
    }

    return Object.keys(item).reduce((accum, key) => {
      accum[key] = omitting.includes(key) ? CodedError.OMISSION : CodedError._anyToObject({
        item: item[key],
        omitting
      });
      return accum;
    }, {});
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


  static _normalizeOmitting(omitting = []) {
    if (omitting === null || omitting === undefined) omitting = true;
    if (typeof omitting === 'boolean') return omitting ? ['stack'] : [];
    return (omitting ? Array.isArray(omitting) ? omitting : [omitting] : []).reduce((accum, it) => {
      if (typeof it === 'string') accum.push(it);
      return accum;
    }, []);
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


  constructor({
    cause,
    msg,
    info,
    _n,
    _c
  } = {}) {
    super(CodedError._message({
      code: _c,
      msg,
      cause
    }));
    this.name = _n;
    this.code = _c;
    this.cause = cause;
    this.info = info;
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


  toObject({
    omitting = 'stack'
  } = {}) {
    omitting = CodedError._normalizeOmitting(typeof arguments[0] === 'boolean' ? arguments[0] : omitting);
    return Object.keys(this).concat(['message', 'stack']).reduce((accum, key) => {
      if (key === 'cause') {
        // possibly recurse here
        accum.cause = omitting.includes(key) ? CodedError.OMISSION : CodedError._anyToObject({
          item: this.cause,
          omitting
        });
        return accum;
      }

      return CodedError._setOrOmit({
        omitting,
        on: accum,
        from: this,
        key
      });
    }, {});
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


  toJson({
    omitting = 'stack',
    replacer,
    spaces
  } = {}) {
    try {
      return JSON.stringify(this.toObject({
        omitting
      }), replacer, spaces);
    } catch (e) {
      const fallback = {
        jsonStringifyError: {},
        error: {}
      };
      omitting = CodedError._normalizeOmitting(omitting);
      ['message', 'code', 'name', 'stack'].forEach(key => {
        ['jsonStringifyError', 'error'].forEach(prop => {
          fallback[prop][key] = omitting.includes(key) ? null : (prop === 'error' ? this : e)[key];
        });
      });
      return JSON.stringify(fallback, null, spaces);
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


CodedError.NO_CODE = 'NO_CODE';
CodedError.NO_MESSAGE = 'NO_MESSAGE';
CodedError.OMISSION = null;

function _determineCodeAndName({
  code,
  name
}) {
  if (!name && !code) throw new Error('name or code is required');
  if (name && !code) code = `E_${toUpperSnake(name)}`.replace(/_ERROR$/, '');

  if (code && !name) {
    name = toUpperCamel(code.replace(/^E_/, ''));
    if (!name.endsWith('Error')) name = `${name}Error`;
  }

  return {
    code,
    name
  };
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
  const codename = _determineCodeAndName({
    code,
    name
  });

  code = codename.code;
  name = codename.name;
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
      constructor({
        cause,
        message,
        info,
        _n,
        _c,
        msg
      } = {}) {
        if (typeof arguments[0] === 'string') message = arguments[0];
        if (!message) message = msg;
        _c = _c || code;
        _n = _n || name || _c;
        super({
          cause,
          message,
          info,
          _c,
          _n
        });
        this.message = CodedError._message({
          code: _c,
          message,
          cause
        });
      }

    }
  }[name]; // causes name of class to be value of name

  /**
   * The symbolic error code of the class.
   *
   * @type {string}
   */

  C.CODE = code;

  C.subclass = ({
    code,
    name
  }) => defineErrorClass({
    code,
    name,
    supererror: C
  });

  return C;
};

module.exports = defineErrorClass;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2Vycm9ycy9Db2RlZEVycm9yLmpzIl0sIm5hbWVzIjpbInRvVXBwZXJTbmFrZSIsInRvVXBwZXJDYW1lbCIsInJlcXVpcmUiLCJDb2RlZEVycm9yIiwiRXJyb3IiLCJfbWVzc2FnZSIsImNvZGUiLCJtZXNzYWdlIiwiY2F1c2UiLCJtIiwiTk9fQ09ERSIsIk5PX01FU1NBR0UiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJpdCIsImZpbHRlciIsInVuZGVmaW5lZCIsImpvaW4iLCJfc2V0T3JPbWl0Iiwib21pdHRpbmciLCJvbiIsImZyb20iLCJrZXkiLCJpbmNsdWRlcyIsIk9NSVNTSU9OIiwiX2FueVRvT2JqZWN0IiwiaXRlbSIsInRvT2JqZWN0IiwiX25vcm1hbGl6ZU9taXR0aW5nIiwicmVkdWNlIiwiYWNjdW0iLCJPYmplY3QiLCJrZXlzIiwicHVzaCIsImNvbnN0cnVjdG9yIiwibXNnIiwiaW5mbyIsIl9uIiwiX2MiLCJuYW1lIiwiYXJndW1lbnRzIiwiY29uY2F0IiwidG9Kc29uIiwicmVwbGFjZXIiLCJzcGFjZXMiLCJKU09OIiwic3RyaW5naWZ5IiwiZSIsImZhbGxiYWNrIiwianNvblN0cmluZ2lmeUVycm9yIiwiZXJyb3IiLCJmb3JFYWNoIiwicHJvcCIsIl9kZXRlcm1pbmVDb2RlQW5kTmFtZSIsInJlcGxhY2UiLCJlbmRzV2l0aCIsImRlZmluZUVycm9yQ2xhc3MiLCJzdXBlcmVycm9yIiwiY29kZW5hbWUiLCJDIiwiQ09ERSIsInN1YmNsYXNzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTTtBQUFFQSxFQUFBQSxZQUFGO0FBQWdCQyxFQUFBQTtBQUFoQixJQUFpQ0MsT0FBTyxDQUFDLGlCQUFELENBQTlDO0FBRUE7Ozs7O0FBR0EsTUFBTUMsVUFBTixTQUF5QkMsS0FBekIsQ0FBK0I7QUFDN0I7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7Ozs7Ozs7O0FBV0EsU0FBT0MsUUFBUCxDQUFpQjtBQUNmQyxJQUFBQSxJQURlO0FBRWZDLElBQUFBLE9BRmU7QUFHZkMsSUFBQUE7QUFIZSxNQUliLEVBSkosRUFJUTtBQUNOLFFBQUlDLENBQUMsR0FBR0gsSUFBSSxJQUFJSCxVQUFVLENBQUNPLE9BQTNCO0FBRUFELElBQUFBLENBQUMsSUFBSyxLQUFJRixPQUFPLElBQUlKLFVBQVUsQ0FBQ1EsVUFBVyxFQUEzQzs7QUFFQSxRQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0wsS0FBZCxDQUFKLEVBQTBCO0FBQ3hCQyxNQUFBQSxDQUFDLElBQUssTUFBS0QsS0FBSyxDQUNiTSxHQURRLENBQ0pDLEVBQUUsSUFBSUEsRUFBRSxZQUFZWCxLQUFkLEdBQXNCLENBQUFXLEVBQUUsU0FBRixJQUFBQSxFQUFFLFdBQUYsWUFBQUEsRUFBRSxDQUFFUixPQUFKLEtBQWVKLFVBQVUsQ0FBQ1EsVUFBaEQsR0FBNkRJLEVBRC9ELEVBRVJDLE1BRlEsQ0FFREQsRUFBRSxJQUFJQSxFQUFFLEtBQUssSUFBUCxJQUFlQSxFQUFFLEtBQUtFLFNBRjNCLEVBR1JDLElBSFEsQ0FHSCxJQUhHLENBSVYsR0FKRDtBQUtELEtBTkQsTUFNTztBQUNMVCxNQUFBQSxDQUFDLElBQUlELEtBQUssR0FDTCxLQUFJQSxLQUFLLFlBQVlKLEtBQWpCLEdBQTBCLENBQUFJLEtBQUssU0FBTCxJQUFBQSxLQUFLLFdBQUwsWUFBQUEsS0FBSyxDQUFFRCxPQUFQLEtBQWtCSixVQUFVLENBQUNRLFVBQXZELEdBQXFFSCxLQUFNLEVBRDFFLEdBRU4sRUFGSjtBQUdEOztBQUVELFdBQU9DLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7OztBQVlBLFNBQU9VLFVBQVAsQ0FBbUI7QUFDakJDLElBQUFBLFFBRGlCO0FBRWpCQyxJQUFBQSxFQUZpQjtBQUdqQkMsSUFBQUEsSUFIaUI7QUFJakJDLElBQUFBO0FBSmlCLEdBQW5CLEVBS0c7QUFDREYsSUFBQUEsRUFBRSxDQUFDRSxHQUFELENBQUYsR0FBVUgsUUFBUSxDQUFDSSxRQUFULENBQWtCRCxHQUFsQixJQUF5QnBCLFVBQVUsQ0FBQ3NCLFFBQXBDLEdBQStDSCxJQUFJLENBQUNDLEdBQUQsQ0FBN0Q7QUFDQSxXQUFPRixFQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxTQUFPSyxZQUFQLENBQXFCO0FBQ25CQyxJQUFBQSxJQURtQjtBQUVuQlAsSUFBQUEsUUFBUSxHQUFHO0FBRlEsTUFHakIsRUFISixFQUdRO0FBQ04sUUFBSU8sSUFBSSxLQUFLVixTQUFULElBQXNCVSxJQUFJLEtBQUssSUFBbkMsRUFBeUMsT0FBT0EsSUFBUDtBQUV6QyxRQUFJLE9BQU9BLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEIsT0FBT0EsSUFBUDtBQUU5QixRQUFJZixLQUFLLENBQUNDLE9BQU4sQ0FBY2MsSUFBZCxDQUFKLEVBQXlCLE9BQU9BLElBQUksQ0FBQ2IsR0FBTCxDQUFTQyxFQUFFLElBQUlaLFVBQVUsQ0FBQ3VCLFlBQVgsQ0FBd0I7QUFBRUMsTUFBQUEsSUFBSSxFQUFFWixFQUFSO0FBQVlLLE1BQUFBO0FBQVosS0FBeEIsQ0FBZixDQUFQO0FBRXpCLFFBQUlPLElBQUksWUFBWXhCLFVBQXBCLEVBQWdDLE9BQU93QixJQUFJLENBQUNDLFFBQUwsQ0FBYztBQUFFUixNQUFBQTtBQUFGLEtBQWQsQ0FBUDtBQUVoQ0EsSUFBQUEsUUFBUSxHQUFHakIsVUFBVSxDQUFDMEIsa0JBQVgsQ0FBOEJULFFBQTlCLENBQVg7O0FBRUEsUUFBSU8sSUFBSSxZQUFZdkIsS0FBcEIsRUFBMkI7QUFDekIsYUFBTyxDQUFDLFNBQUQsRUFBWSxNQUFaLEVBQW9CLE9BQXBCLEVBQ0owQixNQURJLENBQ0csQ0FBQ0MsS0FBRCxFQUFRUixHQUFSLEtBQWdCcEIsVUFBVSxDQUFDZ0IsVUFBWCxDQUFzQjtBQUFFQyxRQUFBQSxRQUFGO0FBQVlDLFFBQUFBLEVBQUUsRUFBRVUsS0FBaEI7QUFBdUJULFFBQUFBLElBQUksRUFBRUssSUFBN0I7QUFBbUNKLFFBQUFBO0FBQW5DLE9BQXRCLENBRG5CLEVBQ29GLEVBRHBGLENBQVA7QUFFRDs7QUFFRCxXQUFPUyxNQUFNLENBQUNDLElBQVAsQ0FBWU4sSUFBWixFQUNKRyxNQURJLENBQ0csQ0FBQ0MsS0FBRCxFQUFRUixHQUFSLEtBQWdCO0FBQ3RCUSxNQUFBQSxLQUFLLENBQUNSLEdBQUQsQ0FBTCxHQUFhSCxRQUFRLENBQUNJLFFBQVQsQ0FBa0JELEdBQWxCLElBQ1RwQixVQUFVLENBQUNzQixRQURGLEdBRVR0QixVQUFVLENBQUN1QixZQUFYLENBQXdCO0FBQUVDLFFBQUFBLElBQUksRUFBRUEsSUFBSSxDQUFDSixHQUFELENBQVo7QUFBbUJILFFBQUFBO0FBQW5CLE9BQXhCLENBRko7QUFHQSxhQUFPVyxLQUFQO0FBQ0QsS0FOSSxFQU1GLEVBTkUsQ0FBUDtBQU9EO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVBLFNBQU9GLGtCQUFQLENBQTJCVCxRQUFRLEdBQUcsRUFBdEMsRUFBMEM7QUFDeEMsUUFBSUEsUUFBUSxLQUFLLElBQWIsSUFBcUJBLFFBQVEsS0FBS0gsU0FBdEMsRUFBaURHLFFBQVEsR0FBRyxJQUFYO0FBQ2pELFFBQUksT0FBT0EsUUFBUCxLQUFvQixTQUF4QixFQUFtQyxPQUFPQSxRQUFRLEdBQUcsQ0FBQyxPQUFELENBQUgsR0FBZSxFQUE5QjtBQUVuQyxXQUFPLENBQUNBLFFBQVEsR0FBR1IsS0FBSyxDQUFDQyxPQUFOLENBQWNPLFFBQWQsSUFBMEJBLFFBQTFCLEdBQXFDLENBQUNBLFFBQUQsQ0FBeEMsR0FBcUQsRUFBOUQsRUFDSlUsTUFESSxDQUNHLENBQUNDLEtBQUQsRUFBUWhCLEVBQVIsS0FBZTtBQUNyQixVQUFJLE9BQU9BLEVBQVAsS0FBYyxRQUFsQixFQUE0QmdCLEtBQUssQ0FBQ0csSUFBTixDQUFXbkIsRUFBWDtBQUM1QixhQUFPZ0IsS0FBUDtBQUNELEtBSkksRUFJRixFQUpFLENBQVA7QUFLRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7QUFhQUksRUFBQUEsV0FBVyxDQUFFO0FBQ1gzQixJQUFBQSxLQURXO0FBRVg0QixJQUFBQSxHQUZXO0FBR1hDLElBQUFBLElBSFc7QUFJWEMsSUFBQUEsRUFKVztBQUtYQyxJQUFBQTtBQUxXLE1BTVQsRUFOTyxFQU1IO0FBQ04sVUFBTXBDLFVBQVUsQ0FBQ0UsUUFBWCxDQUFvQjtBQUFFQyxNQUFBQSxJQUFJLEVBQUVpQyxFQUFSO0FBQVlILE1BQUFBLEdBQVo7QUFBaUI1QixNQUFBQTtBQUFqQixLQUFwQixDQUFOO0FBRUEsU0FBS2dDLElBQUwsR0FBWUYsRUFBWjtBQUNBLFNBQUtoQyxJQUFMLEdBQVlpQyxFQUFaO0FBQ0EsU0FBSy9CLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUs2QixJQUFMLEdBQVlBLElBQVo7QUFDRDtBQUVEOzs7Ozs7Ozs7OztBQVNBVCxFQUFBQSxRQUFRLENBQUU7QUFDUlIsSUFBQUEsUUFBUSxHQUFHO0FBREgsTUFFTixFQUZJLEVBRUE7QUFDTkEsSUFBQUEsUUFBUSxHQUFHakIsVUFBVSxDQUFDMEIsa0JBQVgsQ0FBOEIsT0FBT1ksU0FBUyxDQUFDLENBQUQsQ0FBaEIsS0FBd0IsU0FBeEIsR0FBb0NBLFNBQVMsQ0FBQyxDQUFELENBQTdDLEdBQW1EckIsUUFBakYsQ0FBWDtBQUVBLFdBQU9ZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLElBQVosRUFBa0JTLE1BQWxCLENBQXlCLENBQUMsU0FBRCxFQUFZLE9BQVosQ0FBekIsRUFDSlosTUFESSxDQUNHLENBQUNDLEtBQUQsRUFBUVIsR0FBUixLQUFnQjtBQUN0QixVQUFJQSxHQUFHLEtBQUssT0FBWixFQUFxQjtBQUFFO0FBQ3JCUSxRQUFBQSxLQUFLLENBQUN2QixLQUFOLEdBQWNZLFFBQVEsQ0FBQ0ksUUFBVCxDQUFrQkQsR0FBbEIsSUFBeUJwQixVQUFVLENBQUNzQixRQUFwQyxHQUErQ3RCLFVBQVUsQ0FBQ3VCLFlBQVgsQ0FBd0I7QUFDbkZDLFVBQUFBLElBQUksRUFBRSxLQUFLbkIsS0FEd0U7QUFDakVZLFVBQUFBO0FBRGlFLFNBQXhCLENBQTdEO0FBR0EsZUFBT1csS0FBUDtBQUNEOztBQUNELGFBQU81QixVQUFVLENBQUNnQixVQUFYLENBQXNCO0FBQUVDLFFBQUFBLFFBQUY7QUFBWUMsUUFBQUEsRUFBRSxFQUFFVSxLQUFoQjtBQUF1QlQsUUFBQUEsSUFBSSxFQUFFLElBQTdCO0FBQW1DQyxRQUFBQTtBQUFuQyxPQUF0QixDQUFQO0FBQ0QsS0FUSSxFQVNGLEVBVEUsQ0FBUDtBQVVEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZUFvQixFQUFBQSxNQUFNLENBQUU7QUFDTnZCLElBQUFBLFFBQVEsR0FBRyxPQURMO0FBRU53QixJQUFBQSxRQUZNO0FBR05DLElBQUFBO0FBSE0sTUFJSixFQUpFLEVBSUU7QUFDTixRQUFJO0FBQ0YsYUFBT0MsSUFBSSxDQUFDQyxTQUFMLENBQWUsS0FBS25CLFFBQUwsQ0FBYztBQUFFUixRQUFBQTtBQUFGLE9BQWQsQ0FBZixFQUE0Q3dCLFFBQTVDLEVBQXNEQyxNQUF0RCxDQUFQO0FBQ0QsS0FGRCxDQUVFLE9BQU9HLENBQVAsRUFBVTtBQUNWLFlBQU1DLFFBQVEsR0FBRztBQUFFQyxRQUFBQSxrQkFBa0IsRUFBRSxFQUF0QjtBQUEwQkMsUUFBQUEsS0FBSyxFQUFFO0FBQWpDLE9BQWpCO0FBRUEvQixNQUFBQSxRQUFRLEdBQUdqQixVQUFVLENBQUMwQixrQkFBWCxDQUE4QlQsUUFBOUIsQ0FBWDtBQUVBLE9BQUMsU0FBRCxFQUFZLE1BQVosRUFBb0IsTUFBcEIsRUFBNEIsT0FBNUIsRUFBcUNnQyxPQUFyQyxDQUE2QzdCLEdBQUcsSUFBSTtBQUNsRCxTQUFDLG9CQUFELEVBQXVCLE9BQXZCLEVBQWdDNkIsT0FBaEMsQ0FBd0NDLElBQUksSUFBSTtBQUM5Q0osVUFBQUEsUUFBUSxDQUFDSSxJQUFELENBQVIsQ0FBZTlCLEdBQWYsSUFBc0JILFFBQVEsQ0FBQ0ksUUFBVCxDQUFrQkQsR0FBbEIsSUFBeUIsSUFBekIsR0FBZ0MsQ0FBQzhCLElBQUksS0FBSyxPQUFULEdBQW1CLElBQW5CLEdBQTBCTCxDQUEzQixFQUE4QnpCLEdBQTlCLENBQXREO0FBQ0QsU0FGRDtBQUdELE9BSkQ7QUFNQSxhQUFPdUIsSUFBSSxDQUFDQyxTQUFMLENBQWVFLFFBQWYsRUFBeUIsSUFBekIsRUFBK0JKLE1BQS9CLENBQVA7QUFDRDtBQUNGOztBQXZPNEI7QUEwTy9COzs7Ozs7Ozs7QUExT00xQyxVLENBS0dPLE8sR0FBVSxTO0FBTGJQLFUsQ0FXR1EsVSxHQUFhLFk7QUFYaEJSLFUsQ0FpQkdzQixRLEdBQVcsSTs7QUFnT3BCLFNBQVM2QixxQkFBVCxDQUFnQztBQUFFaEQsRUFBQUEsSUFBRjtBQUFRa0MsRUFBQUE7QUFBUixDQUFoQyxFQUFnRDtBQUM5QyxNQUFJLENBQUNBLElBQUQsSUFBUyxDQUFDbEMsSUFBZCxFQUFvQixNQUFNLElBQUlGLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBRXBCLE1BQUlvQyxJQUFJLElBQUksQ0FBQ2xDLElBQWIsRUFBbUJBLElBQUksR0FBSSxLQUFJTixZQUFZLENBQUN3QyxJQUFELENBQU8sRUFBeEIsQ0FBMEJlLE9BQTFCLENBQWtDLFNBQWxDLEVBQTZDLEVBQTdDLENBQVA7O0FBRW5CLE1BQUlqRCxJQUFJLElBQUksQ0FBQ2tDLElBQWIsRUFBbUI7QUFDakJBLElBQUFBLElBQUksR0FBR3ZDLFlBQVksQ0FBQ0ssSUFBSSxDQUFDaUQsT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsQ0FBRCxDQUFuQjtBQUNBLFFBQUksQ0FBQ2YsSUFBSSxDQUFDZ0IsUUFBTCxDQUFjLE9BQWQsQ0FBTCxFQUE2QmhCLElBQUksR0FBSSxHQUFFQSxJQUFLLE9BQWY7QUFDOUI7O0FBRUQsU0FBTztBQUFFbEMsSUFBQUEsSUFBRjtBQUFRa0MsSUFBQUE7QUFBUixHQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUFZQSxNQUFNaUIsZ0JBQWdCLEdBQUcsQ0FBQztBQUN4Qm5ELEVBQUFBLElBRHdCO0FBRXhCa0MsRUFBQUEsSUFGd0I7QUFHeEJrQixFQUFBQTtBQUh3QixDQUFELEtBSW5CO0FBQ0osUUFBTUMsUUFBUSxHQUFHTCxxQkFBcUIsQ0FBQztBQUFFaEQsSUFBQUEsSUFBRjtBQUFRa0MsSUFBQUE7QUFBUixHQUFELENBQXRDOztBQUNBbEMsRUFBQUEsSUFBSSxHQUFHcUQsUUFBUSxDQUFDckQsSUFBaEI7QUFDQWtDLEVBQUFBLElBQUksR0FBR21CLFFBQVEsQ0FBQ25CLElBQWhCO0FBRUEsUUFBTW9CLENBQUMsR0FBRztBQUNSLEtBQUNwQixJQUFELEdBQVEsZUFBZWtCLFVBQVUsSUFBSXZELFVBQTdCLEVBQXlDO0FBQy9DOzs7Ozs7Ozs7Ozs7O0FBYUFnQyxNQUFBQSxXQUFXLENBQUU7QUFDWDNCLFFBQUFBLEtBRFc7QUFFWEQsUUFBQUEsT0FGVztBQUdYOEIsUUFBQUEsSUFIVztBQUlYQyxRQUFBQSxFQUpXO0FBS1hDLFFBQUFBLEVBTFc7QUFNWEgsUUFBQUE7QUFOVyxVQU9ULEVBUE8sRUFPSDtBQUNOLFlBQUksT0FBT0ssU0FBUyxDQUFDLENBQUQsQ0FBaEIsS0FBd0IsUUFBNUIsRUFBc0NsQyxPQUFPLEdBQUdrQyxTQUFTLENBQUMsQ0FBRCxDQUFuQjtBQUN0QyxZQUFJLENBQUNsQyxPQUFMLEVBQWNBLE9BQU8sR0FBRzZCLEdBQVY7QUFFZEcsUUFBQUEsRUFBRSxHQUFHQSxFQUFFLElBQUlqQyxJQUFYO0FBQ0FnQyxRQUFBQSxFQUFFLEdBQUdBLEVBQUUsSUFBSUUsSUFBTixJQUFjRCxFQUFuQjtBQUNBLGNBQU07QUFBRS9CLFVBQUFBLEtBQUY7QUFBU0QsVUFBQUEsT0FBVDtBQUFrQjhCLFVBQUFBLElBQWxCO0FBQXdCRSxVQUFBQSxFQUF4QjtBQUE0QkQsVUFBQUE7QUFBNUIsU0FBTjtBQUNBLGFBQUsvQixPQUFMLEdBQWVKLFVBQVUsQ0FBQ0UsUUFBWCxDQUFvQjtBQUFFQyxVQUFBQSxJQUFJLEVBQUVpQyxFQUFSO0FBQVloQyxVQUFBQSxPQUFaO0FBQXFCQyxVQUFBQTtBQUFyQixTQUFwQixDQUFmO0FBQ0Q7O0FBN0I4QztBQUR6QyxJQWdDUmdDLElBaENRLENBQVYsQ0FMSSxDQXFDSTs7QUFFUjs7Ozs7O0FBS0FvQixFQUFBQSxDQUFDLENBQUNDLElBQUYsR0FBU3ZELElBQVQ7O0FBRUFzRCxFQUFBQSxDQUFDLENBQUNFLFFBQUYsR0FBYSxDQUFDO0FBQUV4RCxJQUFBQSxJQUFGO0FBQVFrQyxJQUFBQTtBQUFSLEdBQUQsS0FBb0JpQixnQkFBZ0IsQ0FBQztBQUFFbkQsSUFBQUEsSUFBRjtBQUFRa0MsSUFBQUEsSUFBUjtBQUFja0IsSUFBQUEsVUFBVSxFQUFFRTtBQUExQixHQUFELENBQWpEOztBQUVBLFNBQU9BLENBQVA7QUFDRCxDQXJERDs7QUF1REFHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlAsZ0JBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHsgdG9VcHBlclNuYWtlLCB0b1VwcGVyQ2FtZWwgfSA9IHJlcXVpcmUoJy4uL3N0cmluZy11dGlscycpXG5cbi8qKlxuICogQSBiYXNlIGVycm9yIGNsYXNzIHRoYXQgaGFzIGEgYGNhdXNlYCBwcm9wZXJ0eSwgZm9ybWluZyBhIGNoYWluIG9mIGBFcnJvcmBzLCBhcyB3ZWxsIGFzIGNvbnZlbmllbnQgbWVzc2FnZSAmIG9iamVjdCBmb3JtYXR0aW5nLlxuICovXG5jbGFzcyBDb2RlZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKipcbiAgICogVGhlIGNvZGUgdG8gdXNlIGluIGEgbWVzc2FnZSB3aGVuIHRoZXJlIGlzIG5vIGNvZGUuXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgTk9fQ09ERSA9ICdOT19DT0RFJ1xuXG4gIC8qKlxuICAgKiBUaGUgbWVzc2FnZSBzdHJpbmcgdG8gdXNlIHdoZW4gdGhlcmUgaXMgbm8gbWVzc2FnZS5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBOT19NRVNTQUdFID0gJ05PX01FU1NBR0UnXG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSB0byB1c2Ugd2hlbiBvbWl0dGluZyBhIHZhbHVlLlxuICAgKiBAdHlwZSB7bnVsbH1cbiAgICovXG4gIHN0YXRpYyBPTUlTU0lPTiA9IG51bGxcblxuICAvKipcbiAgICogRm9ybWF0cyBhbiBlcnJvciBtZXNzYWdlIHN1aXRhYmxlIGZvciB0aGUgYEVycm9yYCBjb25zdHJ1Y3Rvci5cbiAgICogQWx3YXlzIGluY2x1ZGVzIGluZm9ybWF0aW9uIGZyb20gYXZhaWxhYmxlIGBtZXNzYWdlYCwgYGNvZGVgIHByb3BlcnRpZXMgcmVjdXJzaXZlbHkgdGhyb3VnaCBgY2F1c2VgLlxuICAgKiBUaG91Z2ggbm90IHByZXZlbnRlZCBvciByZW1vdmVkLCBjYWxsZXJzIGFyZSBkaXNjb3VyYWdlZCBmcm9tIHVzaW5nIG5ld2xpbmVzIG9yIGNhcnJpYWdlIHJldHVybnMgaW4gYG1lc3NhZ2VgIHRleHQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbYXJnMD17fV0gVGhlIGFyZ3VtZW50IHRvIGJlIGRlY29uc3RydWN0ZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gW2FyZzAuY29kZT11bmRlZmluZWRdIFRoZSBlcnJvciBjb2RlOyBpZiBmYWxzZXksIHRoZW4ge0BsaW5rIENvZGVkRXJyb3IuTk9fQ09ERX0gaXMgdXNlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFthcmcwLm1lc3NhZ2U9dW5kZWZpbmVkXSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsqfSBbYXJnMC5jYXVzZT11bmRlZmluZWRdIFRoZSBlcnJvcidzIGNhdXNlLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgZXJyb3IgbWVzc2FnZS5cbiAgICovXG4gIHN0YXRpYyBfbWVzc2FnZSAoe1xuICAgIGNvZGUsXG4gICAgbWVzc2FnZSxcbiAgICBjYXVzZVxuICB9ID0ge30pIHtcbiAgICBsZXQgbSA9IGNvZGUgfHwgQ29kZWRFcnJvci5OT19DT0RFXG5cbiAgICBtICs9IGA6ICR7bWVzc2FnZSB8fCBDb2RlZEVycm9yLk5PX01FU1NBR0V9YFxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2F1c2UpKSB7XG4gICAgICBtICs9IGA6IFske2NhdXNlXG4gICAgICAgIC5tYXAoaXQgPT4gaXQgaW5zdGFuY2VvZiBFcnJvciA/IGl0Py5tZXNzYWdlIHx8IENvZGVkRXJyb3IuTk9fTUVTU0FHRSA6IGl0KVxuICAgICAgICAuZmlsdGVyKGl0ID0+IGl0ICE9PSBudWxsICYmIGl0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIC5qb2luKCcsICcpXG4gICAgICB9XWBcbiAgICB9IGVsc2Uge1xuICAgICAgbSArPSBjYXVzZVxuICAgICAgICA/IGA6ICR7Y2F1c2UgaW5zdGFuY2VvZiBFcnJvciA/IChjYXVzZT8ubWVzc2FnZSB8fCBDb2RlZEVycm9yLk5PX01FU1NBR0UpIDogY2F1c2V9YFxuICAgICAgICA6ICcnXG4gICAgfVxuXG4gICAgcmV0dXJuIG1cbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgZ2l2ZW4gYGtleWAgaXMgbm90IG9taXR0ZWQsIHNldHMgYG9uW2tleV1gIHRvIHRoZSB2YWx1ZSBvZiBgZnJvbVtrZXldYC5cbiAgICogSWYgdGhlIGdpdmVuIGBrZXlgIF9pc18gb21pdHRlZCwgc2V0IGBvbltrZXldYCB0byBgbnVsbGAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhcmcwIFRoZSBhcmd1bWVudCB0byBiZSBkZWNvbnN0cnVjdGVkLlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBvbWl0dGluZyBUaGUgbm9ybWFsaXplZCBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBiZWluZyBvbWl0dGVkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gb24gVGhlIHRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgYmVpbmcgc2V0IG9yIG9taXR0ZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmcm9tIFRoZSBzb3VyY2Ugb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGJlaW5nIHNldCBvciBvbW1pdHRlZCBvbiBgdGFyZ2V0YC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IGJlaW5nIHNldCBvciBvbWl0dGVkIG9uIGB0YXJnZXRgIGZyb20gYGZyb21gLlxuICAgKiBAcmV0dXJuIFRoZSB2YWx1ZSBnaXZlbiBpbiBgb25gLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIF9zZXRPck9taXQgKHtcbiAgICBvbWl0dGluZyxcbiAgICBvbixcbiAgICBmcm9tLFxuICAgIGtleVxuICB9KSB7XG4gICAgb25ba2V5XSA9IG9taXR0aW5nLmluY2x1ZGVzKGtleSkgPyBDb2RlZEVycm9yLk9NSVNTSU9OIDogZnJvbVtrZXldXG4gICAgcmV0dXJuIG9uXG4gIH1cblxuICAvKipcbiAgICogU2FmZWx5IHJldHVybnMgdGhlIGdpdmVuIGl0ZW0gYXMgYSBwbGFpbiBvYmplY3Qgb3IgcHJpbWl0aXZlIHR5cGUgd2l0aCBzcGVjaWFsIGNvbnNpZGVyYXRpb24gZm9yIHtAbGluayBDb2RlZEVycm9yfXMgJiBgRXJyb3Jgcy5cbiAgICpcbiAgICogKiBJZiBgaXRlbWAgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLCByZXR1cm5zIHRoZSBpdGVtLlxuICAgKiAqIElmIGBpdGVtYCBzYXRpc2ZpZXMgYHR5cGVvZiBpdGVtICE9PSAnb2JqZWN0J2AsIHJldHVybnMgdGhlIGl0ZW0uXG4gICAqICogSWYgYGl0ZW1gIGlzIGFuIGBBcnJheWAsIHJldHVybnMgYW4gYEFycmF5YCB3aXRoIGl0cyBlbGVtZW50cyBwYXNzZWQgdG8gdGhpcyBtZXRob2QuXG4gICAqICogSWYgYGl0ZW1gIGlzIGEge0BsaW5rIENvZGVkRXJyb3J9IG9yIGBFcnJvcmAsIHJldHVybnMgdGhlIGl0ZW0gdXNpbmcge0BsaW5rIENvZGVkRXJyb3IjdG9PYmplY3R9IG9yIGFzIGEgbGl0ZXJhbCBvYmplY3QsIHJlc3BlY3RpdmVseS5cbiAgICogKiBPdGhlcndpc2UsIHRoZSBpdGVtJ3Mga2V5cyBhcmUgZW51bWVyYXRlZCAodmlhIGBPYmplY3Qua2V5cyhpdGVtKWApIGFuZCBwYXNzZWQgdG8gdGhpcyBtZXRob2QgcmVjdXJzaXZlbHk7IHRoZSByZXR1cm4gdmFsdWUgYmVjb21lcyB0aGUgdmFsdWUgYXQgdGhhdCBrZXkuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbYXJnMD17fV0gVGhlIGFyZ3VtZW50IHRvIGJlIGRlY29uc3RydWN0ZWQuXG4gICAqIEBwYXJhbSB7Kn0gW2FyZzAuaXRlbT11bmRlZmluZWRdIFRoZSBpdGVtIHRvIGNvbnZlcnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfGJvb2xlYW59IFthcmcwLm9taXR0aW5nPVtdXSBUaGUgcHJvcGVydHkgbmFtZXMgdG8gb21pdCByZWN1cnNpdmVseSBkdXJpbmcgKEBsaW5rIENvZGVkRXJyb3IjdG9PYmplY3R9LlxuICAgKiBJZiBhIGBib29sZWFuYCwgd2hldGhlciB0byBvbWl0IGBzdGFja2AgaWYgYHRydWVgLCBvciBpbmNsdWRlIGBzdGFja2AgaWYgYGZhbHNlLlxuICAgKiBJZiBhIHByb3BlcnR5IGlzIG9taXR0ZWQsIGl0cyB2YWx1ZSBpcyBleHBsaWNpdGx5IHNldCB0byBgbnVsbGAsIGFzIGFwcG9zZWQgdG8gYHVuZGVmaW5lZGAsIGluIGFuIGVmZm9ydCB0byBjb21tdW5pY2F0ZSB0aGF0IGl0IHdhcyBwcmVzZW50IGJ1dCBhY3RpdmVseSBvbWl0dGVkLlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgX2FueVRvT2JqZWN0ICh7XG4gICAgaXRlbSxcbiAgICBvbWl0dGluZyA9ICdzdGFjaydcbiAgfSA9IHt9KSB7XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCB8fCBpdGVtID09PSBudWxsKSByZXR1cm4gaXRlbVxuXG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnb2JqZWN0JykgcmV0dXJuIGl0ZW1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSByZXR1cm4gaXRlbS5tYXAoaXQgPT4gQ29kZWRFcnJvci5fYW55VG9PYmplY3QoeyBpdGVtOiBpdCwgb21pdHRpbmcgfSkpXG5cbiAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIENvZGVkRXJyb3IpIHJldHVybiBpdGVtLnRvT2JqZWN0KHsgb21pdHRpbmcgfSlcblxuICAgIG9taXR0aW5nID0gQ29kZWRFcnJvci5fbm9ybWFsaXplT21pdHRpbmcob21pdHRpbmcpXG5cbiAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gWydtZXNzYWdlJywgJ25hbWUnLCAnc3RhY2snXVxuICAgICAgICAucmVkdWNlKChhY2N1bSwga2V5KSA9PiBDb2RlZEVycm9yLl9zZXRPck9taXQoeyBvbWl0dGluZywgb246IGFjY3VtLCBmcm9tOiBpdGVtLCBrZXkgfSksIHt9KVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhpdGVtKVxuICAgICAgLnJlZHVjZSgoYWNjdW0sIGtleSkgPT4ge1xuICAgICAgICBhY2N1bVtrZXldID0gb21pdHRpbmcuaW5jbHVkZXMoa2V5KVxuICAgICAgICAgID8gQ29kZWRFcnJvci5PTUlTU0lPTlxuICAgICAgICAgIDogQ29kZWRFcnJvci5fYW55VG9PYmplY3QoeyBpdGVtOiBpdGVtW2tleV0sIG9taXR0aW5nIH0pXG4gICAgICAgIHJldHVybiBhY2N1bVxuICAgICAgfSwge30pXG4gIH1cblxuICAvKipcbiAgICogU2FmZWx5IG5vcm1hbGl6ZXMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIHRvIGJlIG9taXR0ZWQgZHVyaW5nIChAbGluayBDb2RlZEVycm9yI3RvT2JqZWN0fSBhbmQgKEBsaW5rIENvZGVkRXJyb3IuX2FueVRvT2JqZWN0fS5cbiAgICogQW55IG5vbi1zdHJpbmcgZWxlbWVudHMgYXJlIHNpbGVudGx5IGlnbm9yZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfGJvb2xlYW59IFtvbWl0dGluZz1bXV0gVGhlIHByb3BlcnR5IG5hbWVzIHRvIG9taXQgcmVjdXJzaXZlbHkgZHVyaW5nIChAbGluayBDb2RlZEVycm9yI3RvT2JqZWN0fS5cbiAgICogSWYgYSBgYm9vbGVhbmAsIHdoZXRoZXIgdG8gb21pdCBgc3RhY2tgIGlmIGB0cnVlYCwgb3IgaW5jbHVkZSBgc3RhY2tgIGlmIGBmYWxzZS5cbiAgICogSWYgYSBwcm9wZXJ0eSBpcyBvbWl0dGVkLCBpdHMgdmFsdWUgaXMgZXhwbGljaXRseSBzZXQgdG8gYG51bGxgLCBhcyBhcHBvc2VkIHRvIGB1bmRlZmluZWRgLCBpbiBhbiBlZmZvcnQgdG8gY29tbXVuaWNhdGUgdGhhdCBpdCB3YXMgcHJlc2VudCBidXQgYWN0aXZlbHkgb21pdHRlZC5cbiAgICogQHJldHVybiB7c3RyaW5nW119IEFuIGFycmF5IG9mIHN0cmluZ3MuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgX25vcm1hbGl6ZU9taXR0aW5nIChvbWl0dGluZyA9IFtdKSB7XG4gICAgaWYgKG9taXR0aW5nID09PSBudWxsIHx8IG9taXR0aW5nID09PSB1bmRlZmluZWQpIG9taXR0aW5nID0gdHJ1ZVxuICAgIGlmICh0eXBlb2Ygb21pdHRpbmcgPT09ICdib29sZWFuJykgcmV0dXJuIG9taXR0aW5nID8gWydzdGFjayddIDogW11cblxuICAgIHJldHVybiAob21pdHRpbmcgPyBBcnJheS5pc0FycmF5KG9taXR0aW5nKSA/IG9taXR0aW5nIDogW29taXR0aW5nXSA6IFtdKVxuICAgICAgLnJlZHVjZSgoYWNjdW0sIGl0KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgaXQgPT09ICdzdHJpbmcnKSBhY2N1bS5wdXNoKGl0KVxuICAgICAgICByZXR1cm4gYWNjdW1cbiAgICAgIH0sIFtdKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZzAgVGhlIGFyZ3VtZW50IHRvIGJlIGRlY29uc3RydWN0ZWQuXG4gICAqIEBwYXJhbSB7RXJyb3J8RXJyb3JbXX0gW2FyZzAuY2F1c2VdIEFuIG9wdGlvbmFsIGNhdXNlIG9yIGxpc3Qgb2YgY2F1c2VzIG9mIHRoaXMgZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbYXJnMC5tc2ddIEFuIG9wdGlvbmFsIG1lc3NhZ2UuXG4gICAqIFRob3VnaCBub3QgcHJldmVudGVkIG9yIHJlbW92ZWQsIGNhbGxlcnMgYXJlIGRpc2NvdXJhZ2VkIGZyb20gdXNpbmcgbmV3bGluZXMgb3IgY2FycmlhZ2UgcmV0dXJucyBpbiBgbWVzc2FnZWAgdGV4dC5cbiAgICogQHBhcmFtIHsqfSBbYXJnMC5pbmZvXSBBbiBvcHRpb25hbCB2YWx1ZSBvZiBhbnkga2luZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFthcmcwLl9uXSAgQSBuYW1lIGZvciBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcy5cbiAgICogTm90IGludGVuZGVkIGZvciBwdWJsaWMgY29uc3VtcHRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbYXJnMC5fY10gQSBjb2RlIGZvciBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcy5cbiAgICogTm90IGludGVuZGVkIGZvciBwdWJsaWMgY29uc3VtcHRpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoe1xuICAgIGNhdXNlLFxuICAgIG1zZyxcbiAgICBpbmZvLFxuICAgIF9uLFxuICAgIF9jXG4gIH0gPSB7fSkge1xuICAgIHN1cGVyKENvZGVkRXJyb3IuX21lc3NhZ2UoeyBjb2RlOiBfYywgbXNnLCBjYXVzZSB9KSlcblxuICAgIHRoaXMubmFtZSA9IF9uXG4gICAgdGhpcy5jb2RlID0gX2NcbiAgICB0aGlzLmNhdXNlID0gY2F1c2VcbiAgICB0aGlzLmluZm8gPSBpbmZvXG4gIH1cblxuICAvKipcbiAgICogU2FmZWx5IHJldHVybnMgdGhpcyBvYmplY3QgYXMgYSBwbGFpbiwgSmF2YVNjcmlwdCBvYmplY3QgbGl0ZXJhbCwgc3VpdGFibGUgZm9yIHVzZSB3aXRoIGBKU09OLnN0cmluZ2lmeSgpYCwgZXRjLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdHxib29sZWFufSBbYXJnMD17fV0gVGhlIGFyZ3VtZW50IHRvIGJlIGRlY29uc3RydWN0ZWQsIG9yLCBpZiBhIGBib29sZWFuYCwgYW4gaW5kaWNhdGlvbiB0byBvbWl0IGBzdGFja2AgaWYgYHRydWVgLCBlbHNlIGluY2x1ZGUgYHN0YWNrYCBpZiBgZmFsc2VgLlxuICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXXxib29sZWFufSBbYXJnMC5vbWl0dGluZz0nc3RhY2snXSBUaGUgcHJvcGVydHkgbmFtZXMgdG8gb21pdCByZWN1cnNpdmVseSBkdXJpbmcgKEBsaW5rIENvZGVkRXJyb3IjdG9PYmplY3R9LlxuICAgKiBJZiBhIGBib29sZWFuYCwgd2hldGhlciB0byBvbWl0IGBzdGFja2AgaWYgYHRydWVgLCBvciBpbmNsdWRlIGBzdGFja2AgaWYgYGZhbHNlYC5cbiAgICogSWYgYSBwcm9wZXJ0eSBpcyBvbWl0dGVkLCBpdHMgdmFsdWUgaXMgZXhwbGljaXRseSBzZXQgdG8gYG51bGxgLCBhcyBhcHBvc2VkIHRvIGB1bmRlZmluZWRgLCBpbiBhbiBlZmZvcnQgdG8gY29tbXVuaWNhdGUgdGhhdCBpdCB3YXMgcHJlc2VudCBidXQgYWN0aXZlbHkgb21pdHRlZC5cbiAgICogQHJldHVybiB7b2JqZWN0fSBBIHBsYWluLCBsaXRlcmFsIEphdmFTY3JpcHQgb2JqZWN0IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgZXJyb3IuICBTZWUgUkVBRE1FLm1kIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgdG9PYmplY3QgKHtcbiAgICBvbWl0dGluZyA9ICdzdGFjaydcbiAgfSA9IHt9KSB7XG4gICAgb21pdHRpbmcgPSBDb2RlZEVycm9yLl9ub3JtYWxpemVPbWl0dGluZyh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnYm9vbGVhbicgPyBhcmd1bWVudHNbMF0gOiBvbWl0dGluZylcblxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKS5jb25jYXQoWydtZXNzYWdlJywgJ3N0YWNrJ10pXG4gICAgICAucmVkdWNlKChhY2N1bSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjYXVzZScpIHsgLy8gcG9zc2libHkgcmVjdXJzZSBoZXJlXG4gICAgICAgICAgYWNjdW0uY2F1c2UgPSBvbWl0dGluZy5pbmNsdWRlcyhrZXkpID8gQ29kZWRFcnJvci5PTUlTU0lPTiA6IENvZGVkRXJyb3IuX2FueVRvT2JqZWN0KHtcbiAgICAgICAgICAgIGl0ZW06IHRoaXMuY2F1c2UsIG9taXR0aW5nXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gYWNjdW1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29kZWRFcnJvci5fc2V0T3JPbWl0KHsgb21pdHRpbmcsIG9uOiBhY2N1bSwgZnJvbTogdGhpcywga2V5IH0pXG4gICAgICB9LCB7fSlcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWNhdXNlIHlvdSBkb24ndCB3YW50IGVycm9yIGhhbmRsaW5nIHRocm93aW5nIG9yIGxvZ2dpbmcgZXJyb3JzLCB0aGlzIG1ldGhvZCBhdHRlbXB0cyB0byBgSlNPTi5zdHJpbmdpZnlgIGl0c2VsZi5cbiAgICogSW4gdGhlIGV2ZW50IHRoYXQgYEpTT04uc3RyaW5naWZ5YCB0aHJvd3MgYW4gYEVycm9yYCwgYSBmYWxsYmFjayBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgb2JqZWN0IGlzIHJldHVybmVkLlxuICAgKiBUaGUgZmFsbGJhY2sgb2JqZWN0IGluY2x1ZGVzIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgICogKiBgZXJyb3JgLCB3aXRoIHRoZSBgbWVzc2FnZWAsIGBjb2RlYCwgYG5hbWVgICYgYHN0YWNrYCBvZiB0aGlzIGVycm9yIChzdWJqZWN0IHRvIGBvbWl0dGluZ2ApLCBhbmRcbiAgICogKiBganNvblN0cmluZ2lmeUVycm9yYCwgd2l0aCB0aGUgc2FtZSBwcm9wZXJ0aWVzIGFzIGFib3ZlIGV4Y2VwdCBmcm9tIHRoZSBgSlNPTi5zdHJpbmdpZnlgIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gW2FyZzA9dW5kZWZpbmVkXSBUaGUgYXJndW1lbnQgdG8gYmUgZGVjb25zdHJ1Y3RlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW118Ym9vbGVhbn0gW2FyZzAub21pdHRpbmc9J3N0YWNrJ10gVGhlIHByb3BlcnR5IG5hbWVzIHRvIG9taXQgcmVjdXJzaXZlbHkgZHVyaW5nIChAbGluayBDb2RlZEVycm9yI3RvT2JqZWN0fS5cbiAgICogSWYgYSBgYm9vbGVhbmAsIHdoZXRoZXIgdG8gb21pdCBgc3RhY2tgIGlmIGB0cnVlYCwgb3IgaW5jbHVkZSBgc3RhY2tgIGlmIGBmYWxzZS5cbiAgICogSWYgYSBwcm9wZXJ0eSBpcyBvbWl0dGVkLCBpdHMgdmFsdWUgaXMgZXhwbGljaXRseSBzZXQgdG8gYG51bGxgLCBhcyBhcHBvc2VkIHRvIGB1bmRlZmluZWRgLCBpbiBhbiBlZmZvcnQgdG8gY29tbXVuaWNhdGUgdGhhdCBpdCB3YXMgcHJlc2VudCBidXQgYWN0aXZlbHkgb21pdHRlZC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZzAucmVwbGFjZXJdIFRoZSBbYHRvSlNPTmAgcmVwbGFjZXIgZnVuY3Rpb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0pTT04vc3RyaW5naWZ5KSB0byB1c2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnMC5zcGFjZXNdIFRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIHVzZSBmb3IgaW5kZW50YXRpb24uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHRvSnNvbiAoe1xuICAgIG9taXR0aW5nID0gJ3N0YWNrJyxcbiAgICByZXBsYWNlcixcbiAgICBzcGFjZXNcbiAgfSA9IHt9KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvT2JqZWN0KHsgb21pdHRpbmcgfSksIHJlcGxhY2VyLCBzcGFjZXMpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc3QgZmFsbGJhY2sgPSB7IGpzb25TdHJpbmdpZnlFcnJvcjoge30sIGVycm9yOiB7fSB9XG5cbiAgICAgIG9taXR0aW5nID0gQ29kZWRFcnJvci5fbm9ybWFsaXplT21pdHRpbmcob21pdHRpbmcpO1xuXG4gICAgICBbJ21lc3NhZ2UnLCAnY29kZScsICduYW1lJywgJ3N0YWNrJ10uZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBbJ2pzb25TdHJpbmdpZnlFcnJvcicsICdlcnJvciddLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgZmFsbGJhY2tbcHJvcF1ba2V5XSA9IG9taXR0aW5nLmluY2x1ZGVzKGtleSkgPyBudWxsIDogKHByb3AgPT09ICdlcnJvcicgPyB0aGlzIDogZSlba2V5XVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGZhbGxiYWNrLCBudWxsLCBzcGFjZXMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGVyaXZlcyBhIGNvZGUgJiBuYW1lIGlmIG5lY2Vzc2FyeSBmcm9tIHRoZSBnaXZlbiBjb2RlICYgbmFtZS5cbiAqIEBwYXJhbSBjb2RlXG4gKiBAcGFyYW0gbmFtZVxuICogQHJldHVybiB7e2NvZGU6IHN0cmluZywgbmFtZTogc3RyaW5nfX1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9kZXRlcm1pbmVDb2RlQW5kTmFtZSAoeyBjb2RlLCBuYW1lIH0pIHtcbiAgaWYgKCFuYW1lICYmICFjb2RlKSB0aHJvdyBuZXcgRXJyb3IoJ25hbWUgb3IgY29kZSBpcyByZXF1aXJlZCcpXG5cbiAgaWYgKG5hbWUgJiYgIWNvZGUpIGNvZGUgPSBgRV8ke3RvVXBwZXJTbmFrZShuYW1lKX1gLnJlcGxhY2UoL19FUlJPUiQvLCAnJylcblxuICBpZiAoY29kZSAmJiAhbmFtZSkge1xuICAgIG5hbWUgPSB0b1VwcGVyQ2FtZWwoY29kZS5yZXBsYWNlKC9eRV8vLCAnJykpXG4gICAgaWYgKCFuYW1lLmVuZHNXaXRoKCdFcnJvcicpKSBuYW1lID0gYCR7bmFtZX1FcnJvcmBcbiAgfVxuXG4gIHJldHVybiB7IGNvZGUsIG5hbWUgfVxufVxuXG4vKipcbiAqIERlZmluZXMgYSBuZXcgZXJyb3IgY2xhc3MuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFyZzAgVGhlIGFyZ3VtZW50IHRvIGJlIGRlY29uc3RydWN0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZzAubmFtZV0gIEEgbmFtZSBmb3IgaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MuXG4gKiBUaGlzIGFyZ3VtZW50IG11c3QgYmUgcHJlc2VudCBpZiBgYXJnMC5jb2RlYCBpcyBtaXNzaW5nLCBhbmQgdGhlIGNvZGUgYmVjb21lcyB0aGUgdXBwZXItY2FzZWQgc25ha2UgZm9ybWF0IG9mIHRoZSBuYW1lLlxuICogRm9yIGV4YW1wbGUsIHBhc3NpbmcgdGhlIG5hbWUgYFNvbWV0aGluZ1dpY2tlZEVycm9yYCBjYXVzZXMgdGhlIGBjb2RlYCB0byBiZSBgRV9TT01FVEhJTkdfV0lDS0VEYC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJnMC5jb2RlXSBBIGNvZGUgZm9yIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzXG4gKiBUaGlzIGFyZ3VtZW50IG11c3QgYmUgcHJlc2VudCBpZiBgYXJnMC5uYW1lYCBpcyBtaXNzaW5nLlxuICogRm9yIGV4YW1wbGUsIHBhc3NpbmcgdGhlIGNvZGUgYEVfU09NRVRISU5HX1dJQ0tFRGAgY2F1c2VzIHRoZSBgbmFtZWAgdG8gYmUgYFNvbWV0aGluZ1dpY2tlZEVycm9yYC5cbiAqIEBwYXJhbSB7Kn0gW2FyZzAuc3VwZXJlcnJvcl0gQW4gb3B0aW9uYWwgc3VwZXJjbGFzcyBwcmV2aW91c2x5IHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb24uXG4gKi9cbmNvbnN0IGRlZmluZUVycm9yQ2xhc3MgPSAoe1xuICBjb2RlLFxuICBuYW1lLFxuICBzdXBlcmVycm9yXG59KSA9PiB7XG4gIGNvbnN0IGNvZGVuYW1lID0gX2RldGVybWluZUNvZGVBbmROYW1lKHsgY29kZSwgbmFtZSB9KVxuICBjb2RlID0gY29kZW5hbWUuY29kZVxuICBuYW1lID0gY29kZW5hbWUubmFtZVxuXG4gIGNvbnN0IEMgPSB7XG4gICAgW25hbWVdOiBjbGFzcyBleHRlbmRzIChzdXBlcmVycm9yIHx8IENvZGVkRXJyb3IpIHtcbiAgICAgIC8qKlxuICAgICAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbYXJnczBdIFRoZSBhcmd1bWVudCB0byBiZSBkZWNvbnN0cnVjdGVkLlxuICAgICAgICogQHBhcmFtIHtFcnJvcn0gW2FyZ3MwLmNhdXNlXSBBbiBvcHRpb25hbCBjYXVzZSBvZiB0aGlzIGVycm9yLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFthcmdzMC5tZXNzYWdlXSBBbiBvcHRpb25hbCBtZXNzYWdlLlxuICAgICAgICogSWYgYm90aCBgbWVzc2FnZWAgYW5kIGBtc2dgIGFyZSBwcm92aWRlZCwgYG1lc3NhZ2VgIHRha2VzIHByZWNlZGVuY2UuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MwLm1zZ10gRGVwcmVjYXRlZDsgdXNlIGBtZXNzYWdlYC5cbiAgICAgICAqIElmIGJvdGggYG1lc3NhZ2VgIGFuZCBgbXNnYCBhcmUgcHJvdmlkZWQsIGBtZXNzYWdlYCB0YWtlcyBwcmVjZWRlbmNlLlxuICAgICAgICogQHBhcmFtIHsqfSBbYXJnczAuaW5mb10gQW4gb3B0aW9uYWwgdmFsdWUgb2YgYW55IGtpbmQuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MwLl9uXSBBbiBvcHRpb25hbCBuYW1lIGZvciBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzczsgZGVmYXVsdHMgdG8ge0BwYXJhbSBfY30uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MwLl9jXSBBbiBvcHRpb25hbCBjb2RlIGZvciBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzczsgZGVmYXVsdHMgdG8gdGhlIGNvZGUgdmFsdWUgd2hlbiB0aGUgY2xhc3Mgd2FzIGRlZmluZWQuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0cnVjdG9yICh7XG4gICAgICAgIGNhdXNlLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBpbmZvLFxuICAgICAgICBfbixcbiAgICAgICAgX2MsXG4gICAgICAgIG1zZ1xuICAgICAgfSA9IHt9KSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJykgbWVzc2FnZSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBpZiAoIW1lc3NhZ2UpIG1lc3NhZ2UgPSBtc2dcblxuICAgICAgICBfYyA9IF9jIHx8IGNvZGVcbiAgICAgICAgX24gPSBfbiB8fCBuYW1lIHx8IF9jXG4gICAgICAgIHN1cGVyKHsgY2F1c2UsIG1lc3NhZ2UsIGluZm8sIF9jLCBfbiB9KVxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBDb2RlZEVycm9yLl9tZXNzYWdlKHsgY29kZTogX2MsIG1lc3NhZ2UsIGNhdXNlIH0pXG4gICAgICB9XG4gICAgfVxuICB9W25hbWVdIC8vIGNhdXNlcyBuYW1lIG9mIGNsYXNzIHRvIGJlIHZhbHVlIG9mIG5hbWVcblxuICAvKipcbiAgICogVGhlIHN5bWJvbGljIGVycm9yIGNvZGUgb2YgdGhlIGNsYXNzLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgQy5DT0RFID0gY29kZVxuXG4gIEMuc3ViY2xhc3MgPSAoeyBjb2RlLCBuYW1lIH0pID0+IGRlZmluZUVycm9yQ2xhc3MoeyBjb2RlLCBuYW1lLCBzdXBlcmVycm9yOiBDIH0pXG5cbiAgcmV0dXJuIENcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVFcnJvckNsYXNzXG4iXX0=