var Package = function (options) {
  options = options || {};
  this.name = options.name;
  this.url = options.url;
};

Package.prototype = {
  validate: function () {
    if (typeof this.name !== 'string')
      throw 'name is not a string';

    if (typeof this.url !== 'string')
      throw 'url is not a string';

    if (! this.url.match(/^git\:\/\//))
      throw 'url is not a git url';
  },

  toJSON: function () {
    return {
      name: this.name,
      url: this.url
    };
  }
};

exports.Package = Package;