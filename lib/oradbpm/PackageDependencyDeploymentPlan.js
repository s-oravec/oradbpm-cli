'use strict';

function PackageDependencyDeploymentPlan() {
  var self = this;
  return self;
}

/*
options - create resolutions as options to createDeploymentPlan
{
  foo: {
    version: 1.0.0
    bar : {
      foo: {
        version: 1.0.0
      }
    }
  }
}
*/
PackageDependencyDeploymentPlan.prototype.createDeploymentPlan = function (packageDependencyTree, options) {
  var self = this;
};

module.exports = PackageDependencyDeploymentPlan;
