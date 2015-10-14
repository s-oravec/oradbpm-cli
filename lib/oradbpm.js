'use strict';

var fs = require('fs'),
  allowSelfSignedCertificates = require('config').get('allowSelfSignedCertificates'),
  config = require('config');

// Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
if (allowSelfSignedCertificates === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

exports.getVersion = function () {
  return JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
};

exports.search = require('./oradbpm-search').search;
exports.login = require('./oradbpm-login').login;
exports.publish = require('./oradbpm-publish').publish;
exports.bumpVersion = require('./oradbpm-bump-version').bumpVersion;

