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

  add: function (pkg) {
    var defer = Q.defer();

    for (var i = this.packages.length - 1; i >= 0; i--) {
      if (this.packages[i].url === pkg.url || this.packages[i].name === pkg.name) {
        defer.reject();
        return defer.promise;
      }
    }

    this.packages.push(pkg);
    defer.resolve();

    return defer.promise;
  }
};

exports.MemoryAdapter = MemoryAdapter;