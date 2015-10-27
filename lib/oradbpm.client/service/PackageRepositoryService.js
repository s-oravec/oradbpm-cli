'use strict';

var Bluebird = require('bluebird');
var debug = require('debug')('oradbpm:PackageRepositoryService');

/**
 *
 * @param options
 * @constructor
 */
function PackageRepositoryServiceFactory(options) {

  debug('PackageRepositoryServiceFactory called with options', options);

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

  /**
   * publish packageVersion: PackageVersion
   * return promise which resolves with PackageDetail object
   * @param packageVersion
   */
  PackageRepositoryService.prototype.publish = function (packageVersion) {
  };

  PackageRepositoryService.prototype.login = function (credentials) {
    debug('login', credentials);
    return Bluebird.resolve();
  };

  return new PackageRepositoryService();
}

exports.PackageRepositoryServiceFactory = PackageRepositoryServiceFactory;

