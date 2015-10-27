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
  } else {
    this.message = message;
  }
  this.exitCode = exitCode || 1;
}

var HandleRequestError = function (err) {
  if (err.error) {
    // rp returned error message and statusCode
    throw new PackageRepositoryServiceError(err.error.message, err.statusCode);
  } else {
    throw new PackageRepositoryServiceError(err);
  }
};

/**
 *
 * @param options
 * @constructor
 */
function PackageRepositoryServiceFactory(options) {

  debug('PackageRepositoryServiceFactory called with options', options);

  var _options = options || defaultRepositoryConfig;
  if (_options.allowSelfSignedCertificates === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  var _localConfigFileService = require('./LocalConfigFileService').LocalConfigFileServiceFactory();
  var _jarFile = __dirname + '/../../../config/cookie.json';
  var _jar;

  /**
   *
   * @returns {*} promise which resolves with request cookie jar with file store in _jarFile
   */
  var getJar = function () {
    // if not exists create empty
    return fs.statAsync(_jarFile)
      .catch(function (err) {
        return fs.writeFileAsync(_jarFile, '');
      })
      .then(function () {
        return rp.jar(new FileCookieStore(_jarFile));
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
    return fs.unlinkAsync(_jarFile)
      .catch(function (err) {
        throw new PackageRepositoryServiceError('Not logged into repository.');
      })
      .finally(function () {
        return Bluebird.resolve();
      });
  };

  /**
   * login to repository and store session cookie in cookie jar
   * @param username
   * @param password
   * @returns {*}
   */
  PackageRepositoryService.prototype.login = function (username, password) {

    // TODO: refactor to function
    // get jar
    return getJar()
      .then(function (jar) {
        // create request-promise options
        return {
          method: 'POST',
          uri: _options.uri + ':' + _options.port + '/api/auth/signin',
          body: {
            username: username,
            password: password
          },
          json: true,
          jar: jar
        };
      })
      // call request
      .then(rp)
      .catch(HandleRequestError);

  };

  /**
   * publish packageVersion: PackageVersion
   * return promise which resolves with PackageDetail object
   * @param packageVersion
   */
  PackageRepositoryService.prototype.publish = function (packageFilePath, tag) {
    debug('arguments', arguments);
    return fs.readFileAsync(packageFilePath, 'utf8')
      .then(function (data) {
        debugData('package data', data);
        return JSON.parse(data);
      })
      .then(function (packgeObject) {
        return getJar()
          .then(function (jar) {
            // create request-promise options
            return {
              method: 'POST',
              uri: _options.uri + ':' + _options.port + '/api/1/packages',
              body: packgeObject,
              json: true,
              jar: jar
            };
          });
      })
      // call request
      .then(rp)
      .catch(HandleRequestError);
  };

  return new PackageRepositoryService();
}

exports.PackageRepositoryServiceFactory = PackageRepositoryServiceFactory;

