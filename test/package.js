/*jshint undef:false, expr:true, strict:false */

var Package = require('../lib/package').Package;

require('chai').should();

describe('Package', function () {
  beforeEach(function () {
    this.pkg = new Package();
  });

  describe('#validate', function () {
    describe('without name and url', function () {
      it('should return two errors', function () {
        this.pkg.name = undefined;
        this.pkg.url = undefined;
        this.pkg.validate().should.include.members(['name is not a string', 'url is not a string']);
      });
    });

    describe('without url', function () {
      it('should return an error', function () {
        this.pkg.name = 'jquery';
        this.pkg.url = undefined;
        this.pkg.validate().should.include.members(['url is not a string']);
      });
    });

    describe('without name', function () {
      it('should return an error', function () {
        this.pkg.name = undefined;
        this.pkg.url = 'git://github.com/jquery/jquery.git';
        this.pkg.validate().should.include.members(['name is not a string']);
      });
    });

    describe('with a bad url', function () {
      it('should return errors', function () {
        this.pkg.name = 'jquery';
        this.pkg.url = 'http://github.com/jquery/jquery';
        this.pkg.validate().should.include.members(['url is not a git url']);
      });
    });

    describe('with a name and a git url', function () {

      describe('without private flag', function () {
        describe('with a git protocol url', function () {
          it('should not throw an exception', function () {
            this.pkg.name = 'jquery';
            this.pkg.url = 'git://github.com/jquery/jquery.git';
            this.pkg.validate().should.equal(false);
          });
        });

        describe('with a ssh url', function () {
          it('should throw an exception', function () {
            this.pkg.name = 'jquery';
            this.pkg.url = 'git@github.com:jquery/jquery.git';
            this.pkg.validate().should.include.members(['private url is not accepted']);
          });
        });

        describe('with a ssh git url', function () {
          it('should throw an exception', function () {
            this.pkg.name = 'test';
            this.pkg.url = 'ssh://custom-host.com/jquery/metrics.git';
            this.pkg.validate().should.include.members(['url is not a git url']);
          });
        });
      });

      describe('with private flag', function () {
        describe('with a ssh url', function () {
          it('should not throw an exception', function () {
            this.pkg.name = 'jquery';
            this.pkg.url = 'git@github.com:jquery/jquery.git';
            this.pkg.validate({private: true}).should.equal(false);
          });
        });

        describe('with a ssh url', function () {
          it('should not throw an exception', function () {
            this.pkg.name = 'test';
            this.pkg.url = 'ssh://custom-host.com/jquery/metrics.git';
            this.pkg.validate({private: true}).should.equal(false);
          });
        });

        describe('with a https url', function () {
          it('should not throw an exception', function () {
            this.pkg.name = 'test';
            this.pkg.url = 'https://custom-host.com/jquery/metrics.git';
            this.pkg.validate({private: true}).should.equal(false);
          });
        });

        describe('with a http url', function () {
          it('should not throw an exception', function () {
            this.pkg.name = 'test';
            this.pkg.url = 'http://custom-host.com/jquery/metrics.git';
            this.pkg.validate({private: true}).should.equal(false);
          });
        });
      });

    });
  });
});