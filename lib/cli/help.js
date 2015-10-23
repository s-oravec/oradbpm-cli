'use strict';

 var HelpController = require('./../../lib/oradbpm/controller/help.controller');

exports.addToProgram = function (program) {
  program
    .command('help [command]')
    .description('show help on specific command')
    .action(HelpController.getHelp);
};
