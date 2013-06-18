var Q = require('q');

var MemoryAdapter = function () {
  this.packages = [];
};

MemoryAdapter.prototype = {
  find: function () {
    var defer = Q.defer();
    defer.resolve(this.packages);
    return defer.promise;
  },

  add: function (package) {
    var defer = Q.defer();
    this.packages.push(package);
    defer.resolve();
    return defer.promise;
  }
};

exports.MemoryAdapter = MemoryAdapter;