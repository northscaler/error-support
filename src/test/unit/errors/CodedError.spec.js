/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const CodedError = require('../../../main/errors/CodedError')

describe('unit tests of CodedError', function () {
  it('should throw if no name or code', () => {
    expect(() => CodedError({})).to.throw()
  })

  it('should have code & no name or cause', () => {
    const code = 'E_MY'
    const name = 'MyError'

    const MyError = CodedError({ code })

    const msg = 'boom'
    const e = new MyError({ msg })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(e.name).to.equal(name)
    expect(e.code).to.equal(code)
    expect(e.code).to.equal(MyError.CODE)
    expect(e.message).to.equal(`${code}: ${msg}`)
    expect(MyError.isInstance(e)).to.equal(true)
    expect(MyError.isInstance()).not.to.be.ok()
    console.error(e)
  })

  it('should have a cause and code as name', () => {
    const causeCode = 'E_MY_ERROR_CAUSE'
    const code = 'E_MY'
    const name = 'MyError'

    const MyErrorCause = CodedError({ code: causeCode })
    const MyError = CodedError({ code })

    const msg = 'boom'
    const causeMsg = 'because many badness so high'
    const cause = new MyErrorCause({ msg: causeMsg })
    const e = new MyError({ msg, cause })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(MyError.CODE).to.equal(code)
    expect(MyErrorCause.CODE).to.equal(causeCode)
    expect(e.name).to.equal(name)
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(`${code}: ${msg}: ${causeCode}: ${causeMsg}`)
    console.error(e)
  })

  it('should work with no args', () => {
    const causeCode = 'E_MY_ERROR_CAUSE'
    const code = 'E_MY'

    const MyErrorCause = CodedError({ code: causeCode })
    const MyError = CodedError({ code: code })

    const cause = new MyErrorCause()
    const e = new MyError({ cause })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(e.name).to.equal('MyError')
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(`${code}: ${causeCode}`)
    console.error(e)
  })

  it('should work with a supererror & no name', () => {
    const superCode = 'E_SUPER'
    const subCode = 'E_SUB'

    const Super = CodedError({ code: superCode })
    const Sub = Super.subclass({ code: subCode })

    const e = new Sub()

    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(Sub)
    expect(e).to.be.instanceOf(Super)
    expect(e.name).to.equal('SubError')
    expect(e.code).to.equal(subCode)
    expect(e.message).to.equal(`${subCode}`)
    expect(() => { throw new Sub() }).to.throw(Sub)
    expect(() => { throw new Sub() }).to.throw(Super)
    console.error(e)
  })

  it('should have name, code & no cause', () => {
    const NAME = 'MyError'
    const CODE = 'E_MY_ERROR'

    const MyError = CodedError({ code: CODE, name: NAME })

    const msg = 'boom'
    const e = new MyError({ msg })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(e.name).to.equal(NAME)
    expect(e.code).to.equal(CODE)
    expect(e.message).to.equal(`${CODE}: ${msg}`)
    console.error(e)
  })

  it('should have name & no cause', () => {
    const name = 'MyError'
    const code = 'E_MY'

    const MyError = CodedError({ name })

    const msg = 'boom'
    const e = new MyError({ msg })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(e.name).to.equal(name)
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(`${code}: ${msg}`)
    console.error(e)
  })

  it('should have a cause and code as name', () => {
    const causeName = 'MyCauseError'
    const causeCode = 'E_MY_CAUSE'
    const name = 'MyError'
    const code = 'E_MY'

    const MyCauseError = CodedError({ name: causeName })
    const MyError = CodedError({ name })

    const msg = 'boom'
    const causeMsg = 'because many badness so high'
    const cause = new MyCauseError({ msg: causeMsg })
    const e = new MyError({ msg, cause })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(MyError.CODE).to.equal(code)
    expect(MyCauseError.CODE).to.equal(causeCode)
    expect(e.name).to.equal(name)
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(`${code}: ${msg}: ${causeCode}: ${causeMsg}`)
    console.error(e)
  })

  it('should work with no args', () => {
    const causeName = 'MyCauseError'
    const causeCode = 'E_MY_CAUSE'
    const name = 'MyError'
    const code = 'E_MY'

    const MyErrorCause = CodedError({ name: causeName })
    const MyError = CodedError({ name })

    const cause = new MyErrorCause()
    const e = new MyError({ cause })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(e.name).to.equal(name)
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(`${code}: ${causeCode}`)
    console.error(e)
  })

  it('should work with a supererror, a subclass & a subclass subclass', () => {
    const superCode = 'E_SUPER'
    const subCode = 'E_SUB'
    const sub2Code = 'E_SUB2'

    const Super = CodedError({ code: superCode })
    const Sub = Super.subclass({ code: subCode })
    const Sub2 = Sub.subclass({ code: sub2Code })

    const e = new Sub2()

    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(Sub2)
    expect(e).to.be.instanceOf(Sub)
    expect(e).to.be.instanceOf(Super)
    expect(e.name).to.equal('Sub2Error')
    expect(e.code).to.equal(sub2Code)
    expect(e.message).to.equal(`${sub2Code}`)
    console.error(e)
  })

  it('should work with named error & supererror', () => {
    const SUPERCODE = 'E_SUPER'
    const SUPERNAME = 'Super'
    const SUBCODE = 'E_SUB'
    const SUBNAME = 'Sub'

    const Super = CodedError({ code: SUPERCODE, name: SUPERNAME })
    const Sub = Super.subclass({ code: SUBCODE, name: SUBNAME })

    const e = new Sub()

    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(Sub)
    expect(e).to.be.instanceOf(Super)
    expect(e.name).to.equal(SUBNAME)
    expect(e.code).to.equal(SUBCODE)
    expect(e.message).to.equal(`${SUBCODE}`)
    console.error(e)
  })
})
