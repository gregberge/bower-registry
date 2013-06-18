/*jshint undef:false, expr:true, strict:false */

var Package = require('../lib/package').Package;

require('chai').should();

describe('Package', function () {
  beforeEach(function () {
    this.pkg = new Package();
  });

  describe('#validate', function () {
    describe('without name or url', function () {
      it('should throw an exception', function () {
        // without url and name
        this.pkg.name = undefined;
        this.pkg.url = undefined;
        this.pkg.validate.should.throw;

        // without url
        this.pkg.name = 'jquery';
        this.pkg.url = undefined;
        this.pkg.validate.should.throw;

        // without name
        this.pkg.name = undefined;
        this.pkg.url = 'git://github.com/jquery/jquery.git';
        this.pkg.validate.should.throw;
      });
    });

    describe('with a bad url', function () {
      it('should throw an exception', function () {
        this.pkg.name = 'jquery';
        this.pkg.url = 'http://github.com/jquery/jquery';
        this.pkg.validate.should.throw;
      });
    });

    describe('with a name and a git url', function () {
      it('should not throw an exception', function () {
        this.pkg.name = 'jquery';
        this.pkg.url = 'git://github.com/jquery/jquery';
        this.pkg.validate.should.not.throw;
      });
    });
  });
});