var Q = require('q');

var MemoryAdapter = function () {
  this.packages = [];
};

MemoryAdapter.prototype = {
  find: function () {
    var defer = Q.defer();
    defer.resolve(this.packages);
    return defer.promise;
  }
};

exports.MemoryAdapter = MemoryAdapter;