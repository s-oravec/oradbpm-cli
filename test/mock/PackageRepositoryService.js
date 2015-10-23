'use strict';

var Bluebird = require('bluebird'),
  _ = require('lodash'),
  semver = require('semver');

var PackageNotFound = function (message) {
  this.name = 'PackageNotFound';
  this.message = message || 'Package not found';
  this.stack = (new Error()).stack;
};

exports.PackageNotFound = PackageNotFound;

function PackageRepositoryServiceFactory(options) {

  var data = [];

  var PackageRepositoryService = function () {
  };

  PackageRepositoryService.prototype.setData = function (_data) {
    data = _data;
  };

  PackageRepositoryService.prototype.search = function (query) {
    return Bluebird.resolve(_.where(data, {name: query}));
  };

  PackageRepositoryService.prototype.get = function (name) {
    var pkgs = _.where(data, {name: name});
    if (pkgs && pkgs.length > 0) {
      return Bluebird.resolve(pkgs[0]);
    } else {
      return Bluebird.reject(new PackageNotFound('Package "' + name + '" not found'));
    }
  };

  PackageRepositoryService.prototype.publish = function (packageVersion) {
    return this
      .get(packageVersion.name)
      .catch(function (err) {
        console.log(JSON.stringify(err));
        if (err.name === 'PackageNotFound') {
          return Bluebird.resolve()
            .then(function () {
              var newPackage = {
                name: packageVersion.name,
                tags: {},
                versions: [],
                packageVersions: {}
              };
              data.push(newPackage);
              return newPackage;
            });
        } else {
          throw err;
        }
      })
      .then(function (pkgDetail) {
        pkgDetail.tags.latest = packageVersion.version;
        pkgDetail.versions.push(packageVersion.version);
        pkgDetail.versions.sort(semver.compare);
        pkgDetail.packageVersions[packageVersion.version] = {
          dependencies: packageVersion.dependencies || {}
        };
        return pkgDetail;
      }
    );
  };

  return new PackageRepositoryService();
}

exports.PackageRepositoryServiceFactory = PackageRepositoryServiceFactory;

//var f = PackageRepositoryServiceFactory();
//f.setData([
//  {
//    name: 'bar',
//    tags: {
//      'latest': '1.0.0'
//    },
//    versions: ['1.0.0', '1.2.0'],
//    packageVersions: {
//      '1.0.0': {},
//      '1.2.0': {
//        dependencies: {
//          'baz': '1.0.0'
//        }
//      }
//    }
//  },
//  {
//    name: 'baz',
//    tags: {
//      'latest': '1.0.0'
//    },
//    versions: ['1.0.0', '1.2.0'],
//    packageVersions: {
//      '1.0.0': {}
//    }
//  }
//]);

//f.get('bar')
//  .then(function (pkg) {
//    console.log(JSON.stringify(pkg, null, 2));
//  });

//f.publish({
//  name: 'foo',
//  version: '0.0.1'
//}).then(function (pkg) {
//  console.log(JSON.stringify(pkg, null, 2));
//})
//  .then(function () {
//    return f.get('foo')
//      .then(function (pkg) {
//        console.log(JSON.stringify(pkg, null, 2));
//      });
//  });
