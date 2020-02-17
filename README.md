# `error-support`
Convenient error classes and error class factories.

In addition to providing many common errors, this module provides a convenient function for creating `Error` subclasses that include additional properties
* `code` to hold a programmatic symbol representing the error,
* `cause` to hold the causing `Error`, and
* `info` to hold any contextual information you may want to include.

## Common error classes
This is a partial list of common error classes provided by this module:

* `AlreadyInitializedError`
* `ClassNotExtendableError`
* `IllegalArgumentError`
* `IllegalArgumentTypeError`
* `IllegalStateError`
* `MethodNotImplementedError`
* `MissingRequiredArgumentError`
* `NotInitializedError`

There may be more than these.
Check the source for all errors provided by this module.
All error classes can be found in `./errors`.

Usage example of an error provided by this module:
```javascript
const IllegalArgumentError = require('@northscaler/error-support/errors/IllegalArgumentError')
throw new IllegalArgumentError({msg: 'foobar'})
```

## Error class factory
This folder contains a base error class, `CodedError`, upon which are built many other convenient error classes.

Here is an example of defining your own error classes using `CodedError`:

```javascript
// in file SomethingWickedError.js:

const CodedError = require('@northscaler/error-support/errors/CodedError')

module.exports = CodedError({ code: 'E_SOMETHING_WICKED' })
```

You then use the class like this:
```javascript
const SomethingWickedError = require('./SomethingWickedError')

function foobar() {
  try {
    // ...
  }
  catch (e) {
    throw new SomethingWickedError({
      msg: 'boom',
      info: { some: 'contextual values here'},
      cause: e
    })
  }
}

function example() {
  try {
    foobar()
  } catch (e) {
    if (e.code === SomethingWickedError.CODE) { // 'E_SOMETHING_WICKED'
      // ...
    }
  }
}
```
