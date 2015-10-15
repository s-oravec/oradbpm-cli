'use strict';

var config = require('config'),
  Bluebird = require('bluebird'),
  fs = Bluebird.promisifyAll(require('fs')),
  rp = require('request-promise'),
  chalk = require('chalk'),
  semver = require('semver'),
  FileCookieStore = require('tough-cookie-filestore');

//TODO: refactor exceptions
var ValidationError = function (message) {
  this.error = {
    message: message
  };
  this.name = 'ValidationError';
};

var validatePackage = function (oraDBPacakgeJSON) {
  return new Bluebird(function (resolve, reject) {
    if (
      semver.valid(oraDBPacakgeJSON.version, true) === null ||
      semver.clean(oraDBPacakgeJSON.version) !== oraDBPacakgeJSON.version
    ) {
      throw new ValidationError('Package version is invalid.');
    }
    resolve(oraDBPacakgeJSON);
  });
};

var publish = function () {
  console.log('Publishing package');

  fs.readFileAsync('oradb_package.json', 'utf8')
    .then(JSON.parse)
    .then(validatePackage)
    .then(function (oraDBPacakgeJSON) {
      var options = {
        method: 'POST',
        uri: config.get('repository').uri + ':' + config.get('repository').port + config.get('repository').method.publish,
        body: oraDBPacakgeJSON,
        json: true,
        jar: new rp.jar(new FileCookieStore(config.get('cookieStoreFileName')))
      };
      return rp(options);
    })
    .then(function () {
      console.log(chalk.green('Successfully published.\n'));
    })
    //TODO: refactor to common ErrorHandler
    // catch rp error
    .catch(function (err) {
      console.error(chalk.red((err.statusCode ? err.statusCode + ' ' : '') + err.error.message));
    });
};

exports.publish = publish;
