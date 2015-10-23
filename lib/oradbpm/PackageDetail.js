'use strict';

var _ = require('lodash');

/**
 *
 * Loaded from repository
 * - contains information about specific version and list of all tags and versions
 *
 * @param packageDetail
 * @returns {PackageDetail}
 * @constructor
 */
function PackageDetail(packageDetail) {
  var self = this;

  _.assign(self, packageDetail);

  return self;
}

/**
 *
 * @type {PackageDetail}
 */
module.exports = PackageDetail;
