'use strict';

/**
 *
 * @param debug debug instance
 * @constructor
 */
exports.errorHandler = function (debug) {
  return function(err) {
    if (debug) debug('catch %s', JSON.stringify(err));
    throw err;
  };
};

exports.OraDBPMClientError = function (message, exitCode) {
  this.name = 'OraDBPMClientError';
  this.message = message;
  this.exitCode = exitCode || 1;
};
