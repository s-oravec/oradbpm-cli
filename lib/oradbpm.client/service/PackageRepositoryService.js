'use strict';

// path to default config
process.env.NODE_CONFIG_DIR = __dirname + '/../../../config';

var Bluebird = require('bluebird');
var defaultRepositoryConfig = require('config').get('repository');
var rp = require('request-promise');
var fs = Bluebird.promisifyAll(require('fs'));
var FileCookieStore = require('tough-cookie-filestore');
var chalk = require('chalk');
var debug = require('debug')('oradbpm:service:package-repository');
var debugData = require('debug')('oradbpm:data');
var _ = require('lodash');

// TODO: split each method to separate file

/**
 * PackageRepositoryServiceError
 * @param message error message
 * @param exitCode exit code - use response statusCode
 * @constructor
 */
function PackageRepositoryServiceError(message, exitCode) {
  this.name = 'PackageRepositoryServiceError';
  // TODO: error map
  if (message === 'Name_1_version already exists') {
    this.message = 'Package name/version already exists in repository';
  } else if (message === 'connect ECONNREFUSED') {
    this.message = 'Unable to connect to repository. Check your repository config and network connection.';
  } else {
    this.message = message;
  }
  this.exitCode = exitCode || 1;
}

/**
 * Handler for request-promise errors
 * @param err
 * @throws PackageRepositoryServiceError
 */
var handleRequestError = function (err) {
  if (err.error) {
    // rp returned error message and statusCode
    throw new PackageRepositoryServiceError(err.error.message, err.statusCode);
  } else {
    throw new PackageRepositoryServiceError(err);
  }
};

/**
 * PackageRepositoryService Factory
 * @param options
 * @return PackageRepositoryService
 */
function PackageRepositoryServiceFactory(options) {

  debug('PackageRepositoryServiceFactory called with options', options);

  var _options = options || defaultRepositoryConfig;
  if (_options.allowSelfSignedCertificates === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  var _jarFilePath = __dirname + '/../../../config/cookie.json';

  /**
   *
   * @returns {*} promise which resolves with request options
   * with cookie jar with file store in _jarFilePath
   */
  var createRequestOptions = function (method, path, body) {
    // if not exists create empty cookie jar file
    return fs.statAsync(_jarFilePath)
      .catch(function (err) {
        if (err) {
          /* ignore error - create empty cookie jar file */
        }
        return fs.writeFileAsync(_jarFilePath, '');
      })
      .then(function () {
        return {
          method: method,
          uri: _options.uri + ':' + _options.port + path,
          body: body,
          json: true,
          jar: rp.jar(new FileCookieStore(_jarFilePath))
        };
      });
  };

  /**
   * PackageRepositoryService exposes interface to PackageRepository
   *  -
   * @returns {PackageRepositoryService}
   * @constructor
   */
  var PackageRepositoryService = function () {
  };

  /**
   * search repository
   * return promise which resolves with array of PackageDetail objects
   * @param query
   */
  PackageRepositoryService.prototype.search = function (query) {
  };

  /**
   * return promise which resolves with PackageDetail object
   * @param name
   * @param version
   */
  PackageRepositoryService.prototype.get = function (name) {
  };

  PackageRepositoryService.prototype.publish = function (packageVersion) {
  };

  PackageRepositoryService.prototype.logout = function () {
    return fs.unlinkAsync(_jarFilePath)
      // TODO: catch only file not exists
      .catch(function (err) {
        if (err) {
          /* raise new error instead */
        }
        throw new PackageRepositoryServiceError('Not logged into repository.');
      })
      .finally(function () {
        return createRequestOptions('GET', '/api/auth/signout')
          .then(rp)
          .catch(handleRequestError);
      });
  };

  /**
   * login to repository and store session cookie in cookie jar
   * @param username
   * @param password
   * @returns {*}
   */
  PackageRepositoryService.prototype.login = function (username, password) {
    return createRequestOptions('POST', '/api/auth/signin', {username: username, password: password})
      .then(rp)
      .catch(handleRequestError);
  };

  /**
   * publish packageVersion: PackageVersion
   * return promise which resolves with PackageDetail object
   * @param packageFilePath
   * @param tag
   * @return {*}
   */
  PackageRepositoryService.prototype.publish = function (packageFilePath, tag) {
    debug('arguments', arguments);
    return fs.readFileAsync(packageFilePath, 'utf8')
      .then(function (data) {
        debugData('package data', data);
        return JSON.parse(data);
      })
      .then(function (packgeObject) {
        return createRequestOptions('POST', '/api/1/packages', packgeObject);
      })
      // call request
      .then(rp)
      .catch(handleRequestError);
  };

  return new PackageRepositoryService();
}

exports.PackageRepositoryServiceFactory = PackageRepositoryServiceFactory;

