'use strict';

var Bluebird = require('bluebird');
var help = require('./cli/help');

function CLI() {
  var self = this;
  self.program = require('commander');

  require('./cli/help').addToProgram(self.program);

}

CLI.prototype.parse = function (argv) {
  var self = this;
  return Bluebird.resolve(self.program.parse(argv))
    .then(function (result) {
      // parsed command
      // console.log(result);
    })
    .catch(function (err) {
      //console.log(err);
    })
    ;
};

module.exports = CLI;
