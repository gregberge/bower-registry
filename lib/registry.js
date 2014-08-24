var express = require('express');
var bodyParser = require('body-parser');
var Package = require('./package').Package;

// Create a new registry with a custom database
var Registry = function (options) {
  options = options || {};

  this.private = options.private;
  this.db = options.db || null;
  this.server = express();
  this.server.use(bodyParser.json());
  this.server.use(bodyParser.urlencoded());
};

Registry.prototype = {

  // Initialize the registry
  initialize: function () {
    // GET /packages
    this.server.get('/packages', function (req, res) {
      this.db.find().then(function (packages) {
        res.send(packages);
      }, function () {
        res.send(500);
      });
    }.bind(this));

    // POST /packages
    this.server.post('/packages', function (req, res) {
      var pkg = new Package({
        name: req.param('name'),
        url: req.param('url')
      });

      if (pkg.validate({private: this.private})) {
        return res.send(400);
      }

      this.db.add(pkg.toJSON()).then(function () {
        res.send(201);
      }, function () {
        res.send(406);
      });
    }.bind(this));

    // GET /packages/:name
    this.server.get('/packages/:name', function (req, res) {
      this.db.find({name: req.params.name}).then(function (packages) {
        if (! packages.length)
          return res.send(404);

        this.db.hit(packages[0].name);
        res.send(packages[0]);
      }.bind(this), function () {
        res.send(500);
      });
    }.bind(this));

    // GET /packages/search/:name
    this.server.get('/packages/search/:name', function (req, res) {
      this.db.find({
        $match: {
          name: req.params.name
        }
      }).then(function (packages) {
        res.send(packages);
      }, function () {
        res.send(500);
      });
    }.bind(this));

    return this;
  },

  // Proxy server.listen
  listen: function () {
    this.server.listen.apply(this.server, arguments);
  }
};

exports.Registry = Registry;