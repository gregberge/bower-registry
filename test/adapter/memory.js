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

});