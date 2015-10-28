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
var urlencode = require('urlencode');

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
  var jarFilePath = __dirname + '/../../../config/cookie.json';

  /**
   *
   * @returns {*} promise which resolves with request options
   * with cookie jar with file store in jarFilePath
   */
  var createRequestOptions = function (method, path, body) {
    // if not exists create empty cookie jar file
    return fs.statAsync(jarFilePath)
      .catch(function (err) {
        if (err) {
          /* ignore error - create empty cookie jar file */
        }
        return fs.writeFileAsync(jarFilePath, '');
      })
      .then(function () {
        return {
          method: method,
          uri: _options.uri + ':' + _options.port + path,
          body: body,
          json: true,
          jar: rp.jar(new FileCookieStore(jarFilePath))
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
   * Logout from repository
   * @return {*} Promise
   */
  PackageRepositoryService.prototype.logout = function () {
    // delete cookie jar file
    return fs.unlinkAsync(jarFilePath)
      .catch(function (err) {
        if (err.code === 'ENOENT') {
          // if cookie jar file not exists - user is not logged in
          throw new PackageRepositoryServiceError('Not logged into repository.');
        }
        // rethrow others
        throw err;
      })
      // logout from repo anyways
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
   * @return {*} Promise
   */
  PackageRepositoryService.prototype.login = function (username, password) {
    debug('usernanme', username);
    return createRequestOptions('POST', '/api/auth/signin', {username: username, password: password})
      .then(rp)
      .catch(handleRequestError);
  };

  /**
   * publish packageVersion: PackageVersion
   * @param packageFilePath
   * @param tag
   * @return {*} Promise which resolves with PackageDetail object
   */
  PackageRepositoryService.prototype.publish = function (packageFilePath, tag) {
    debug('packageFilePath', packageFilePath, 'tag', tag);
    return fs.readFileAsync(packageFilePath, 'utf8')
      .then(function (data) {
        debugData('package data', data);
        return JSON.parse(data);
      })
      .then(function (packgeObject) {
        return createRequestOptions('POST', '/api/1/packages', packgeObject);
      })
      .then(rp)
      .catch(handleRequestError);
  };

  /**
   * search packages in repository
   * @param query
   * @return {*} Promise which resolves with array of PackageDetail objects
   */
  PackageRepositoryService.prototype.search = function (query) {
    debug('query', query);
    return createRequestOptions('GET', '/api/1/packages?q=' + urlencode(query))
      .then(rp)
      .catch(handleRequestError);
  };

  /**
   * get package by name
   * @param name
   * @return {*} Promise which resolves with PackageDetail object
   */
  PackageRepositoryService.prototype.get = function (name) {
    debug('name', name);
    if (!name) throw new PackageRepositoryServiceError('Package name is empty.', 1);
    return createRequestOptions('GET', '/api/1/packages/' + urlencode(name))
      .then(rp)
      .catch(handleRequestError);
  };

  return new PackageRepositoryService();
}

exports.PackageRepositoryServiceFactory = PackageRepositoryServiceFactory;

