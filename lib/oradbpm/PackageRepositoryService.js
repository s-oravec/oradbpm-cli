'use strict';

var Bluebird = require('bluebird');

/**
 *
 * @param options
 * @constructor
 */
function PackageRepositoryServiceFactory(options) {

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

  return new PackageRepositoryService();
}

module.exports = PackageRepositoryServiceFactory;

