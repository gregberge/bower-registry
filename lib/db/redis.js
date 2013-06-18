var Q = require('q'),
    redis = require('redis'),
    async = require('async');

// Create a new Redis database driver
var RedisDb = function (options) {
  options = options || {};
  this.client = options.client || redis.createClient(options.port, options.host, options);
};

RedisDb.prototype = {

  // Find a package
  find: function (where) {
    where = where || {};

    var defer = Q.defer(),
        name = where.$match && where.$match.name ? '*' + where.$match.name + '*' : where.name || '*',
        client = this.client;

    client.keys(name, function (err, keys) {
      if (err)
        return defer.reject();

      async.map(keys, client.get, function (err, urls) {
        if (err)
          return defer.reject();

        defer.resolve(keys.map(function (key, index) {
          return {name: key, url: urls[index]};
        }));
      });
    });

    return defer.promise;
  },

  // Add a package in the db
  add: function (pkg) {
    var defer = Q.defer(),
        client = this.client;

    client.get(pkg.name, function (err, value) {
      if (err)
        return defer.reject();

      if (value !== null)
        return defer.reject();

      client.set(pkg.name, pkg.url, function (err) {
        if (err)
          return defer.reject();

        defer.resolve();
      });
    });

    return defer.promise;
  }
};

exports.RedisDb = RedisDb;