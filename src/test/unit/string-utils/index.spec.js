/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { toSnake, toUpperSnake, toLowerSnake, toCamel, toUpperCamel, toLowerCamel } = require('../../../main/string-utils')

describe('unit tests of string-utils', function () {
  it('should convert camel case to snake', () => {
    expect(toSnake('FooBarBaz')).to.equal('foo_bar_baz')
    expect(toLowerSnake('FooBarBaz')).to.equal('foo_bar_baz')
    expect(toUpperSnake('FooBarBaz')).to.equal('FOO_BAR_BAZ')
    expect(toSnake('Foo')).to.equal('foo')
    expect(toSnake('foo')).to.equal('foo')
    expect(toSnake(undefined)).to.equal(undefined)
  })

  it('should convert snake to camel case', () => {
    expect(toCamel('ONE_TWO_THREE')).to.equal('OneTwoThree')
    expect(toUpperCamel('ONE_TWO_THREE')).to.equal('OneTwoThree')
    expect(toCamel('ONE_TWO_THREE', false)).to.equal('oneTwoThree')
    expect(toLowerCamel('ONE_TWO_THREE', false)).to.equal('oneTwoThree')
    expect(toCamel('ONE__TWO_THREE')).to.equal('OneTwoThree')
    expect(toCamel('ONE__TWO_THREE', false)).to.equal('oneTwoThree')
    expect(toCamel(undefined)).to.equal(undefined)
    expect(toCamel('ONE')).to.equal('One')
    expect(toCamel('ONE', false)).to.equal('one')
  })
})
