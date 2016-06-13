var Q = require('q'),
    mongo = require('mongodb');

// Create a new MongoDB database driver
var MongoDb = function (options) {
  options = options || {};
  var defer = Q.defer();
  mongo.MongoClient.connect(options.url, options, function(err, db) {
    if (err) {
      return defer.reject();
    }

    defer.resolve(db);
  });
  this.client = options.client || defer.promise;
};

MongoDb.prototype = {

  // Find a package
  find: function (where) {
    where = where || {};

    var defer = Q.defer(),
        name = where.$match && where.$match.name ? '.*' + where.$match.name + '.*' : where.name || '.*',
        client = this.client;

    client.then(function (db) {
      var pkgs = db.collection('packages');
      pkgs.find({"name": new RegExp(name)}).toArray(function(err, pkgs) {
        if (err) {
          return defer.reject();
        }

        pkgs = pkgs.map(function (pkg) {
          delete pkg.hits;
          return pkg;
        });

        defer.resolve(pkgs);
      });
    });

    return defer.promise;
  },

  // Add a package in the db
  add: function (pkg) {
    var defer = Q.defer(),
        client = this.client;

    client.then(function (db) {
      var pkgs = db.collection('packages');
      pkgs.findOne({name: pkg.name}, function (err, value) {
        if (err) {
          return defer.reject();
        }

        if (value !== null) {
          return defer.reject();
        }

        pkgs.insert([
            {name: pkg.name, url: pkg.url}
          ], function(err) {
            if (err) {
              return defer.reject();
            }

            defer.resolve();
          }
        );
      });
    });

    return defer.promise;
  },

  // Increment package hit
  hit: function (name) {
    var defer = Q.defer(),
        client = this.client;

    client.then(function (db) {
      var pkgs = db.collection('packages');
      pkgs.update({name: name}
        , { $inc: {hits: 1} }, function(err) {
        if (err) {
          return defer.reject();
        }

        defer.resolve();
      });  
    });

    return defer.promise;
  }
};

exports.MongoDb = MongoDb;