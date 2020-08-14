# `error-support`
Convenient error classes and error class factories.

In addition to providing many common errors, this module provides a convenient function for creating `Error` subclasses that include additional properties
* `code` to hold a programmatic symbol representing the error,
* `cause` to hold the causing `Error` or `Error[]`, and
* `info` to hold any contextual information you may want to include.

Further, each error provides a `toObject` method that converts the error to a plain object literal and a `toJson` method that is guaranteed not to throw, because you don't want errors being thrown during your error handling.

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

There may be more than these if this documentation isn't in sync with the code.
Check the source for all errors provided by this module.
All error classes can be found in `./errors`.

Usage example of an error provided by this module:
```javascript
const IllegalArgumentError = require('@northscaler/error-support').IllegalArgumentError
throw new IllegalArgumentError({msg: 'foobar'})
```

## Error class factory
This folder contains a base error class, `CodedError`, upon which are built many other convenient error classes.

Here is an example of defining your own error classes using `CodedError`:

```javascript
// in file SomethingWickedError.js:

const CodedError = require('@northscaler/error-support').CodedError

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

### Error subclass factory
You can also easily create subclasses of `CodedError` subclasses that were created from the `CodedError` class factory.

Here's how, using the `SomethingWickedError` class above:
```javascript
// in file SomethingReallyWickedError.js:

const SomethingWickedError = require('./SomethingWickedError')

module.exports = SomethingWickedError.subclass({ code: 'E_SOMETHING_REALLY_WICKED' })
```

Now, any instance of `SomethingReallyWicked` is also an `instanceof SomethingWicked`.

## Codes
Unfortunately, JavaScript's `Error` class only supports `name` (if you set it) & `message` to convey error information in a standard way.
Folks haven't been exactly disciplined when it comes to the format of the `message` property.

A common solution to this is to subclass `Error` with one that supports a `code` property (among others, possibly).
The `code` is guaranteed never to change, whereas the `message` can.
Also, `code` can be anything you like, but we recommend `string`s like `E_SOMETHING_BAD`.
`Symbol`s or `number`s aren't a bad idea, but `Symbol`s don't `toString()` very well, and you always have to go look up a `number` to see what it means.

This is exactly what this library does.
In Node.js, there is [a well known issue](https://github.com/nodejs/node/issues/13937) that discusses this.

> NOTE: never depend on the `message` property's content.
> Always use the `code` property in your error handling logic.

## Messages
`CodedError` also provides for pretty well-formatted `message` properties, modeled somewhat after Node.js's message formats.
By default, they don't include newlines or carriage returns, but provide as much detail of the error chain as possible as a simple string.

```javascript
const BadError = CodedError({code: 'E_BAD'})

console.log(new BadError('foobar').message)
// 'E_BAD: foobar'

console.log(new BadError().message)
'E_BAD: NO_MESSAGE'
```

## Causes
`CodedError` not only supports a `code` property, but also a `cause` property, which can be either an array or non-array.
This provides for a cause chain, exactly in the same manner as Java's base [`java.lang.Exception` class](https://docs.oracle.com/javase/8/docs/api/index.html?java/lang/Exception.html).

```javascript
console.log(new BadError({msg: 'this is bad', cause: new BadError('this is why')}).message)
// 'E_BAD: this is bad: E_BAD: this is why'

console.log(new BadError({msg: 'this is bad', cause: new Error('this is why')}).message)
// 'E_BAD: this is bad: this is why'

console.log(new BadError({msg: 'this is bad', cause: 13}).message)
// 'E_BAD: this is bad: 13'
```
## Contextual information
`CodedError` also gives you a property, called `info`, to place arbitrary, contextual information that could be relevant to the error at hand.

```javascript
new BadError({
  msg: 'this is bad',
  info: {
    foo: 'bar',
    sna: { fu: 'goo' }
  }
})
```
## Serializing
`CodedError` provides to convenient methods for converting itself to a POJO (plain, old JavaScript object).

### `toObject`
Use the `toObject` method to convert the `CodedError` chain to a POJO.
By default, the `stack` property is omitted transitively, but you can override that behavior via arguments to `toObject`.

```jvaascript
console.log(new BadError({
  msg: 'this is bad',
  info: {
    foo: 'bar',
    sna: { fu: 'goo' }
  }
}).toObject()
)

// returns:
// {
//   name: 'BadError',
//   code: 'E_BAD',
//   cause: undefined,
//   info: { foo: 'bar', sna: { fu: 'goo' } },
//   message: 'E_BAD: this is bad',
//   stack: null
// }
```

### `toJson`
Since many folks log JSON to their log channels, `CodedError` has a convenient method that _tries_ to `JSON.stringify()` itself.
Note that this is not the same as JavaScript's [`toJSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior) protocol method.

```javascript
new BadError({
  msg: 'this is bad',
  info: {
    foo: 'bar',
    sna: { fu: 'goo' }
  }
}).toJson({ spaces: 2 }) // NOTE: this is NOT the same as toJSON!

// logs:
// {
//   "name": "BadError",
//   "code": "E_BAD",
//   "info": {
//     "foo": "bar",
//     "sna": {
//       "fu": "goo"
//     }
//   },
//   "message": "E_BAD: this is bad",
//   "stack": null
// }
```

> NOTE: if you want to opt in to the `toJSON` protocol, simply have `toJSON` delegate to `toObject`.

#### Omitted properties in JSON
Notice how `stack` is omitted by default.  A couple things about that:
1. `stack` is omitted by default, because you usually only want stack traces in development, so the library makes a conservative choice here.
Use your own configuration to decide what you'll be omitting in your system when logging.
2. You can omit any properties recursively that you want.
It's just that the default is `['stack']`.
3. Omitted properties are omitted all the way down the error chain, except in your `info` context objects.
If properties need to be omitted in your `info` context objects, don't include them.
4. When a property is omitted, the property _name_ remains in the stringified object, but it's _value_ is set to `null`, which is intended to express that the property was present but actively supressed.

#### Errors when handling errors
Sometimes, there could be circular references in the cause chain or any of the chain's `info` properties.
Since you don't want your error handling to be throwing `Error`s when logging, `toJson` is _guaranteed_ to always return valid JSON.
If `JSON.stringify` worked, you'll get that result, but if it throws, you'll get a fallback string that is the JSON representation of the following, subject to your desired omissions:

```javascript
{
  jsonStringifyError: {
    message: '...',
    name: '...',
    code: '...',
    stack: '...'
  },
  error: {
    message: '...',
    name: '...',
    code: '...',
    stack: '...'
  }
}
```

Here's an example.

```javascript
const info = {}
info.circular = info // circular reference

console.log(new BadError({
  msg: 'this is bad',
  info
}).toJson({ spaces: 2 }))

// logs:
// {
//   "jsonStringifyError": {
//     "message": "Converting circular structure to JSON",
//     "name": "TypeError",
//     "stack": null
//   },
//   "error": {
//     "message": "E_BAD: this is bad",
//     "code": "E_BAD",
//     "name": "BadError",
//     "stack": null
//   }
}
```
