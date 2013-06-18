/*jshint undef:false, expr:true, strict:false */

var Registry = require('../index').Registry,
    MemoryAdapter = require('../index').MemoryAdapter,
    request = require('supertest');

require('chai').should();

describe('Registry server', function () {
  beforeEach(function () {
    this.adapter = new MemoryAdapter();

    this.registry = new Registry({
      adapter: this.adapter
    });

    this.registry.initialize();
  });

  describe('/packages', function () {

    beforeEach(function () {
      this.adapter.packages = [
        {
          name: 'jquery',
          url: 'git://github.com/jquery/jquery.git'
        }
      ];
    });

    it('show all packages at /packages', function (done) {
      request(this.registry.server)
      .get('/packages')
      .expect('Content-type', /json/)
      .expect(200, this.adapter.packages, done);
    });
  });

});