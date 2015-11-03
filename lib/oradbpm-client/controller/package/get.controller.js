'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var GitUrlParse = require('git-url-parse');

// dev
var debug = require('debug')('oradbpm:ctrl:view');



var parsePackageReferences = function (pkgReferences) {

  var parsedPackageReferences = Bluebird.resolve();

  if (pkgReferences.length === 0) {
    parsedPackageReferences
      .then(oraDBPMClient.localConfigFileService.read)
      .then(function (pkgDefinition) {
        return pkgDefinition.dependencies;
      })
  }
  else {
    parsedPackageReferences.resolve(pkgReferences);
  }

  var pkgs = [];
  _.map(pkgReferences, function (pkg) {
    pkgs.push(parsePackageReference(pkg));
  });
};

/**
 * @returns {*}
 */
var view = function (pkgReferences, options) {
  debug('pkgReferences', pkgReferences, 'options', options);
  var oraDBPMClient = this;
  return Bluebird.resolve()
    .catch(function (err) {
      // TODO: refactor as common error handler service
      debug('catch', err);
      console.log(chalk.red('Package view failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
      throw err;
    });
};

module.exports = view;
