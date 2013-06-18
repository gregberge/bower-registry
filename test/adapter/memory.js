/*jshint undef:false, expr:true, strict:false */

var MemoryAdapter = require('../../index').MemoryAdapter;

require('chai').should();

describe('MemoryAdapter', function () {
  beforeEach(function () {
    this.adapter = new MemoryAdapter();
  });

  describe('#find', function () {

    beforeEach(function () {
      this.adapter.packages = [
        {
          name: 'jquery',
          url: 'git://github.com/jquery/jquery.git'
        }
      ];
    });

    it('should return all packages', function (done) {
      this.adapter.find().then(function (packages) {
        packages.should.equal(this.adapter.packages);
        done();
      }.bind(this));
    });
  });

  describe('#add', function () {

    describe('if package exist', function () {
      describe('name exist', function () {
        beforeEach(function () {
          this.adapter.packages = [
            {
              name: 'jquery',
              url: 'git://github.com/jquery/jquery.git'
            }
          ];
        });

        it('should return an error', function (done) {
          this.adapter.add({
            name: 'jquery',
            url: 'git://github.com/jquery2/jquery2.git'
          }).then(function () {}, function () {
            done();
          });
        });

        it('should return an error', function (done) {
          this.adapter.add({
            name: 'jquery2',
            url: 'git://github.com/jquery/jquery.git'
          }).then(function () {}, function () {
            done();
          });
        });
      });
    });


    it('should add the package', function (done) {
      this.adapter.add({
        name: 'jquery',
        url: 'git://github.com/jquery/jquery.git'
      }).then(function () {
        this.adapter.packages.should.deep.equal([
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