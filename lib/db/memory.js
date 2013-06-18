var Q = require('q');

var MemoryDb = function () {
  this.packages = [];
};

MemoryDb.prototype = {
  find: function (where) {
    where = where || {};

    var defer = Q.defer(),
    packages = this.packages.filter(function (pkg) {
      for (var key in where) {

        if (key === '$match') {
          for (var matchKey in where[key])
            if (! pkg[matchKey].match(where[key][matchKey]))
              return false;
        }
        else if (where[key] !== pkg[key])
          return false;
      }

      return true;
    });

    defer.resolve(packages);
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

exports.MemoryDb = MemoryDb;