var express = require('express');

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
    });
  }.bind(this));
};


exports.Registry = Registry;