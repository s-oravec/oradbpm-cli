'use strict';

var path = require('path');
var fs = require('fs');
var Bluebird = require('bluebird');
var chalk = require('chalk');

exports.getHelp = function (command) {

  var basepath = path.join(__dirname, '..', '..', '..', 'doc', 'cli'),
    filepath,
    data;

  // filename format: command.txt
  filepath = command + '.txt';

  // full path
  filepath = path.join(basepath, filepath);

  // get help info
  if (!fs.existsSync(filepath)) {
    // TODO: call unknown command handler
    console.log(chalk.red('Unknown command ' + command));
  } else {
    data = fs.readFileSync(filepath, 'utf8');
    data = data.trim();
    console.log('\n' + data + '\n');
  }
};
