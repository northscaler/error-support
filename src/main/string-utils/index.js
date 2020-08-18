'use strict'

/**
 * Converts given camel case (`likeThis`) to snake (`like_this`), optionally upper casing.
 *
 * @param {string} [camel] The camel cased string to convert.
 * @param {boolean} [upper=false] Whether to convert to upper case.
 * @return {string|*} If `camel` is falsey, returns `camel` unchanged, else returns the conversion.
 */
const toSnake = (camel, upper = false) => {
  if (!camel) return camel

  camel = camel
    .toString()
    .replace(/(^([A-Z]))/, (match, it) => `${it.toLowerCase()}`)
    .replace(/([A-Z])/g, (match, it) => `_${it.toLowerCase()}`)

  return upper ? camel.toUpperCase() : camel
}

/**
 * Converts given camel case (`likeThis`) to upper case snake (`LIKE_THIS`).
 *
 * @param {string} [camel] The camel cased string to convert.
 * @return {string|*} If `camel` is falsey, returns `camel` unchanged, else returns the conversion.
 */
const toUpperSnake = camel => toSnake(camel, true)

/**
 * Converts given camel case (`likeThis`) to lower case snake (`like_this`).
 *
 * @param {string} [camel] The camel cased string to convert.
 * @return {string|*} If `camel` is falsey, returns `camel` unchanged, else returns the conversion.
 */
const toLowerSnake = camel => toSnake(camel)

/**
 * Converts given snake (`like_this`) to camel case (`likeThis`), optionally upper casing the leading character.
 *
 * @param {string} [snake] The snake string to convert.
 * @param {boolean} [upper=false] Whether to upper case the leading character.
 * @return {string|*} If `snake` is falsey, returns `snake` unchanged, else returns the conversion.
 */
const toCamel = (snake, upper = true) => {
  if (!snake) return snake

  return snake
    .toString()
    .split('_')
    .reduce((accum, next) => {
      if (!next) return accum

      next = next.toLowerCase()

      if (upper) {
        return `${accum}${next.replace(/^([a-z])/, (match, it) => it.toUpperCase())}`
      } else {
        upper = true
        return next
      }
    }, '')
}

/**
 * Converts given snake (`like_this`) to leading upper camel case (`LikeThis`).
 *
 * @param {string} [snake] The snake string to convert.
 * @return {string|*} If `snake` is falsey, returns `snake` unchanged, else returns the conversion.
 */
const toUpperCamel = snake => toCamel(snake)

/**
 * Converts given snake (`like_this`) to leading lower camel case (`likeThis`).
 *
 * @param {string} [snake] The snake string to convert.
 * @return {string|*} If `snake` is falsey, returns `snake` unchanged, else returns the conversion.
 */
const toLowerCamel = snake => toCamel(snake, false)

module.exports = {
  toSnake,
  toUpperSnake,
  toLowerSnake,
  toCamel,
  toUpperCamel,
  toLowerCamel
}
