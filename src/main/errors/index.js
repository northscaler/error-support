'use strict'

/**
 * `CodedError` & various `CodedError` subclasses.
 */
module.exports = {
  CodedError: require('./CodedError'),
  AlreadyInitializedError: require('./AlreadyInitializedError'),
  ClassNotExtendableError: require('./ClassNotExtendableError'),
  IllegalArgumentError: require('./IllegalArgumentError'),
  IllegalArgumentTypeError: require('./IllegalArgumentTypeError'),
  IllegalStateError: require('./IllegalStateError'),
  MethodNotImplementedError: require('./MethodNotImplementedError'),
  MissingRequiredArgumentError: require('./MissingRequiredArgumentError'),
  NotInitializedError: require('./NotInitializedError')
}
