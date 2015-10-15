'use strict';

var repository = require('config').get('repository'),
  rp = require('request-promise'),
  chalk = require('chalk'),
  _ = require('lodash'),
  prettyjson = require('prettyjson'),
  urlencode = require('urlencode');

//TODO: align name, description, author, date, version, keywords
var logPackage = function (oradbpmPackage) {
  console.log('    ' + chalk.cyan(oradbpmPackage.name) + ' ' + 'tradaaa');
};

// TODO: refactor - move to utils
var decodeKey = function (key) {
  return key.replace(/\uff0e/g, '.').replace(/\uff04/g, '$').replace(/\\\\/g, '\\');
};


var view = function (name) {
  var options = {
    uri: repository.uri + ':' + repository.port + repository.apiUrl.packages + '/' + urlencode(name),
    json: true
  };
  rp(options)
    .then(function (oradbpmPackage) {

      _.map(oradbpmPackage.time, function (value, key) {
        if (decodeKey(key) !== key) {
          oradbpmPackage.time[decodeKey(key)] = value;
          delete oradbpmPackage.time[key];
        }
      });

      oradbpmPackage['__v'] = undefined;
      oradbpmPackage['authorId'] = undefined;
      oradbpmPackage['_id'] = undefined;

      return oradbpmPackage;
    })
    .then(function (oradbpmPackage) {
      console.log(prettyjson.render(oradbpmPackage));
      return;
    })
    .catch(function (err) {
      if (err.error) {
        console.error(chalk.red((err.statusCode ? err.statusCode + ' ' : '') + err.error.message));
      } else {
        console.log(chalk.red(err));
      }
    });

};

exports.view = view;
