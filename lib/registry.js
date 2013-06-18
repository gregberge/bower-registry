var express = require('express'),
    Package = require('./package').Package;

var Registry = function (options) {
  options = options || {};

  this.adapter = options.adapter || null;
  this.server = express();
  this.server.use(express.bodyParser());
};

Registry.prototype.initialize = function () {

  this.server.get('/packages', function (req, res) {
    this.adapter.find().then(function (packages) {
      res.send(packages);
    }, function () {
      res.send(500);
    });
  }.bind(this));

  this.server.post('/packages', function (req, res) {
    var pkg = new Package({
      name: req.param('name'),
      url: req.param('url')
    });

    if (pkg.validate()) {
      return res.send(400);
    }

    this.adapter.add(pkg.toJSON()).then(function () {
      res.send(200);
    }, function () {
      res.send(406);
    });
  }.bind(this));

  this.server.get('/packages/:name', function (req, res) {
    this.adapter.find({name: req.params.name}).then(function (packages) {
      if (! packages.length)
        return res.send(404);

      res.send(packages[0]);
    }, function () {
      res.send(500);
    });
  }.bind(this));

  this.server.get('/packages/search/:name', function (req, res) {
    this.adapter.find({
      $match: {
        name: req.params.name
      }
    }).then(function (packages) {
      res.send(packages);
    }, function () {
      res.send(500);
    });
  }.bind(this));
};


exports.Registry = Registry;