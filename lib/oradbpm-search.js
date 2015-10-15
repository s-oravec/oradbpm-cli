'use strict';

var repository = require('config').get('repository'),
  rp = require('request-promise'),
  chalk = require('chalk'),
  urlencode = require('urlencode');

//TODO: align name, description, author, date, version, keywords
var logResultItem = function (oradbpmPackage) {
  console.log('    ' + chalk.cyan(oradbpmPackage.name) + ' ' + 'tradaaa');
};

var search = function (query) {

  var options = {
    uri: repository.uri + ':' + repository.port + repository.apiUrl.packages + '?searchPhrase=' + urlencode(query),
    json: true
  };

  rp(options)
    .then(function (packages) {
      if (packages.length > 0) {
        console.log('Search results:\n');
        for (var i = 0; i < packages.length; i++) {
          logResultItem(packages[i]);
        }
      } else {
        console.log(chalk.red('No matching packages have been found.\n'));
      }
    })
    .catch(function (err) {
      console.log(err);
    });

};

exports.search = search;
