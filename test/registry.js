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

  describe('GET /packages', function () {
    beforeEach(function () {
      this.adapter.packages = [
        {
          name: 'jquery',
          url: 'git://github.com/jquery/jquery.git'
        }
      ];
    });

    it('should show all avalaible packages', function (done) {
      request(this.registry.server)
        .get('/packages')
        .expect('Content-type', /json/)
        .expect(200, this.adapter.packages, done);
    });
  });

  describe('POST /packages', function () {
    describe('if request is correct', function () {
      it('should add the package and return 200', function (done) {
        request(this.registry.server)
          .post('/packages')
          .send({name: 'jquery', url: 'git://github.com/jquery/jquery.git'})
          .expect(200, done);
      });
    });

    describe('if request is bad', function () {
      it('shouldn\'t add the package and return 400', function (done) {
        request(this.registry.server)
          .post('/packages')
          .send({name: 'jquery'})
          .expect(400, done);
      });
    });

    describe('if the package already exist', function () {
      beforeEach(function () {
        this.adapter.packages = [
          {
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }
        ];
      });

      describe('if the name exists', function () {
        it('should return 406', function (done) {
          request(this.registry.server)
            .post('/packages')
            .send({name: 'jquery', url: 'git://github.com/jquery2/jquery2.git'})
            .expect(406, done);
        });
      });

      describe('if the url exists', function () {
        it('should return 406', function (done) {
          request(this.registry.server)
            .post('/packages')
            .send({name: 'jquery2', url: 'git://github.com/jquery/jquery.git'})
            .expect(406, done);
        });
      });
    });
  });

  describe('GET /packages/:name', function () {
    describe('if the package exists', function () {
      beforeEach(function () {
        this.adapter.packages = [
          {
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }
        ];
      });

      it('should return 200 and the package', function (done) {
        request(this.registry.server)
          .get('/packages/jquery')
          .expect(200, this.adapter.packages[0], done);
      });
    });

    describe('if the package doesn\'t exist', function () {
      it('should return 404', function (done) {
        request(this.registry.server)
          .get('/packages/jquery')
          .expect(404, done);
      });
    });
  });

  describe('GET /packages/search/:name', function () {
    beforeEach(function () {
      this.adapter.packages = [
        {
          name: 'jquery',
          url: 'git://github.com/jquery/jquery.git'
        }
      ];
    });

    it('should return matching packages', function (done) {
      request(this.registry.server)
        .get('/packages/search/jq')
        .expect(200, this.adapter.packages, done);
    });
  });
});