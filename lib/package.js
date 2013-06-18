// Create a new package
var Package = function (options) {
  options = options || {};
  this.name = options.name;
  this.url = options.url;
};

Package.prototype = {

  // Validate the package and return an array of errors
  validate: function () {
    var errors = [];

    if (typeof this.name !== 'string')
      errors.push('name is not a string');

    if (typeof this.url !== 'string')
      errors.push('url is not a string');

    if (this.url && ! this.url.match(/^git\:\/\//))
      errors.push('url is not a git url');

    return errors.length ? errors : false;
  },

  // Return package object
  toJSON: function () {
    return {
      name: this.name,
      url: this.url
    };
  }
};

exports.Package = Package;