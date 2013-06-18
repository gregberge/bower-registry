/*jshint undef:false, expr:true, strict:false */

var MemoryDb = require('../../index').MemoryDb;

require('chai').should();

describe('MemoryDb', function () {
  beforeEach(function () {
    this.db = new MemoryDb();
  });

  describe('#find', function () {
    beforeEach(function () {
      this.db.packages = [
        {
          name: 'jquery',
          url: 'git://github.com/jquery/jquery.git'
        },
        {
          name: 'jqlite',
          url: 'git://github.com/jquery/jqlite.git'
        }
      ];
    });

    describe('without arguments', function () {
      it('should return all packages', function (done) {
        this.db.find().then(function (packages) {
          packages.should.deep.equal(this.db.packages);
          done();
        }.bind(this));
      });
    });

    describe('with a hash matching one value', function () {
      it('should return packages matching the query', function (done) {
        this.db.find({
          name: 'jquery'
        }).then(function (packages) {
          packages.should.deep.equal([{
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }]);
          done();
        }.bind(this));
      });
    });

    describe('with a hash matching 0 value', function () {
      it('should not return packages', function (done) {
        this.db.find({
          name: 'jquery2'
        }).then(function (packages) {
          packages.length.should.equal(0);
          done();
        }.bind(this));
      });
    });

    describe('with a hash with "$match" operator', function () {
      it('should return packages matching the query', function (done) {
        this.db.find({
          $match: {
            name: 'jq'
          }
        }).then(function (packages) {
          packages.length.should.equal(2);
          done();
        });
      });
    });

  });

  describe('#add', function () {
    describe('if package exist', function () {
      describe('name exist', function () {
        beforeEach(function () {
          this.db.packages = [
            {
              name: 'jquery',
              url: 'git://github.com/jquery/jquery.git'
            }
          ];
        });

        it('should return an error', function (done) {
          this.db.add({
            name: 'jquery',
            url: 'git://github.com/jquery2/jquery2.git'
          }).then(function () {}, function () {
            done();
          });
        });

        it('should return an error', function (done) {
          this.db.add({
            name: 'jquery2',
            url: 'git://github.com/jquery/jquery.git'
          }).then(function () {}, function () {
            done();
          });
        });
      });
    });


    it('should add the package', function (done) {
      this.db.add({
        name: 'jquery',
        url: 'git://github.com/jquery/jquery.git'
      }).then(function () {
        this.db.packages.should.deep.equal([
          {
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }
        ]);
        done();
      }.bind(this));
    });
  });

});