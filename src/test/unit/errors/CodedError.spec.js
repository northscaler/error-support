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

  it('should have static members available', function () {
    const MyError = CodedError({ code: 'E_FOOBAR' })
    expect(MyError.NO_MESSAGE).to.equal('NO_MESSAGE')
    expect(MyError.NO_CODE).to.equal('NO_CODE')
  })

  it('should have code & name but no cause', () => {
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
    expect(e).to.be.instanceOf(MyError)
    expect(e).to.be.instanceOf(Error)
    expect(e.toObject()).to.deep.equal({
      message: 'E_MY: boom',
      name: 'MyError',
      stack: null,
      code: 'E_MY',
      info: undefined,
      cause: undefined
    })
  })

  it('should have a cause with code as name', () => {
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
    expect(e.toObject()).to.deep.equal({
      message: 'E_MY: boom: E_MY_ERROR_CAUSE: because many badness so high',
      name: 'MyError',
      stack: null,
      code: 'E_MY',
      info: undefined,
      cause:
        {
          message: 'E_MY_ERROR_CAUSE: because many badness so high',
          name: 'MyErrorCauseError',
          stack: null,
          code: 'E_MY_ERROR_CAUSE',
          info: undefined,
          cause: undefined
        }
    })
  })

  it('should work with no args but a cause', () => {
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
    expect(e.message).to.equal(`${code}: ${MyError.NO_MESSAGE}: ${causeCode}: ${MyErrorCause.NO_MESSAGE}`)
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
    expect(e.message).to.equal(`${subCode}: ${Sub.NO_MESSAGE}`)
    expect(() => { throw new Sub() }).to.throw(Sub)
    expect(() => { throw new Sub() }).to.throw(Super)
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
  })

  it('should have a cause array and code as name', () => {
    const causeName0 = 'MyCause0Error'
    const causeCode0 = 'E_MY_CAUSE0'
    const name = 'MyError'
    const code = 'E_MY'

    const MyCause0Error = CodedError({ name: causeName0 })
    const MyError = CodedError({ name })

    const msg = 'boom'
    const causeMsg0 = 'because many badness so high'
    const cause0 = new MyCause0Error({ msg: causeMsg0 })
    const causeMsg1 = 'because stuff very bad'
    const cause1 = new Error(causeMsg1)
    const cause2 = null
    const cause3 = 13
    const e = new MyError({ msg, cause: [cause0, cause1, cause2, cause3] })
    expect(e).to.be.instanceOf(Error)
    expect(e).to.be.instanceOf(MyError)
    expect(MyError.CODE).to.equal(code)
    expect(MyCause0Error.CODE).to.equal(causeCode0)
    expect(e.name).to.equal(name)
    expect(e.code).to.equal(code)
    expect(e.message).to.equal(`${code}: ${msg}: [${cause0.message}, ${cause1.message}, ${cause3}]`)
    expect(e.toObject()).to.deep.equal({
      message: e.message,
      name,
      stack: null,
      code,
      info: undefined,
      cause: [{
        message: cause0.message,
        name: causeName0,
        stack: null,
        code: causeCode0,
        info: undefined,
        cause: undefined
      }, {
        message: cause1.message,
        name: cause1.name,
        stack: null
      },
      null,
      13]
    })
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
    expect(e.message).to.equal(`${sub2Code}: ${Sub2.NO_MESSAGE}`)
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
    expect(e.message).to.equal(`${SUBCODE}: ${Sub.NO_MESSAGE}`)
  })

  it('should work when JSON.stringify throws', function () {
    const code = 'E_MY'
    const MyError = CodedError({ code })
    const msg = 'boom'

    // make a recursive object in order to cause JSON.stringify to throw
    const info = {}
    info.info = info
    let jsonError
    try {
      JSON.stringify(info)
      expect.fail('should\'ve thrown')
    } catch (x) {
      jsonError = x
    }

    const e = new MyError({ msg, info })
    const json = JSON.parse(e.tryToJson())

    expect(json).to.deep.equal({
      jsonStringifyError: {
        message: jsonError.message,
        name: jsonError.name,
        stack: null
      },
      error: {
        message: e.message,
        name: e.name,
        code: e.code,
        stack: null
      }
    })
  })

  it('should work with permutations on omitting', function () {
    const code = 'E_MY'
    const name = 'MyError'
    const info = {
      one: 1,
      stack: 'should not be omitted because it is part of info, not part of a cause',
      code: '42'
    }

    const MyError = CodedError({ code })
    const cause0 = new Error('the cause0')
    const cause1 = { one: 1, stack: 'again, not a stack', code: '84' }

    const msg = 'boom'
    const e = new MyError({ msg, info, cause: [cause0, cause1] });

    [undefined, true, { omitting: 'stack' }, { omitting: ['stack'] }].forEach(it => {
      expect(e.toObject(it)).to.deep.equal({
        message: e.message,
        name,
        stack: null,
        code: e.code,
        info,
        cause: [{
          message: cause0.message,
          name: cause0.name,
          stack: null
        }, {
          one: cause1.one,
          stack: null,
          code: cause1.code
        }]
      })
    });

    [false, { omitting: [] }].forEach(it => {
      expect(e.toObject(it)).to.deep.equal({
        message: e.message,
        name,
        stack: e.stack,
        code: e.code,
        info,
        cause: [{
          message: cause0.message,
          name: cause0.name,
          stack: cause0.stack
        }, {
          one: cause1.one,
          stack: cause1.stack,
          code: cause1.code
        }]
      })
    });

    ['code'].forEach(it => {
      [{ omitting: it }, { omitting: [it] }].forEach(arg => {
        expect(e.toObject(arg)).to.deep.equal({
          message: e.message,
          name,
          stack: e.stack,
          code: null,
          info,
          cause: [{
            message: cause0.message,
            name: cause0.name,
            stack: cause0.stack
          }, {
            one: cause1.one,
            stack: cause1.stack,
            code: null
          }]
        })
      })
    });

    ['cause'].forEach(it => {
      [{ omitting: it }, { omitting: [it] }].forEach(arg => {
        expect(e.toObject(arg)).to.deep.equal({
          message: e.message,
          name,
          stack: e.stack,
          code: e.code,
          info,
          cause: null
        })
      })
    })

    expect(e.toObject({ omitting: ['message', 'name'] })).to.deep.equal({
      message: null,
      name: null,
      stack: e.stack,
      code: e.code,
      info,
      cause: [{
        message: null,
        name: null,
        stack: cause0.stack
      }, {
        one: cause1.one,
        stack: cause1.stack,
        code: cause1.code
      }]
    })
  })
})
