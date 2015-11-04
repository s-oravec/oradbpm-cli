'use strict';

//var Bluebird = require('bluebird');
var debug = require('debug')('oradbpm:model:package-version-definition-file');
var _ = require('lodash');
var util = require('util');
var JSONFile = require('./json-file.model');
var PackageVersionDefinition = require('./package-version-definition.model');

function PackageVersionDefinitionFile(packageFilePath) {

  var self = this;
  var file = new JSONFile(packageFilePath);

  self.read = function () {
    return file.read()
      .then(function (data) {
        return new PackageVersionDefinition(data);
      });
  };

  self.write = function (packageVersionDefinition) {
    file.write(packageVersionDefinition).then(function () {
      return packageVersionDefinition;
    });
  };

  return self;
}

util.inherits(PackageVersionDefinitionFile, PackageVersionDefinition);

module.exports = PackageVersionDefinitionFile;
