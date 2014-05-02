/*jshint undef:false, expr:true, strict:false */

var Registry = require('../index').Registry,
    RedisDb = require('../index').RedisDb,
    redis = require('redis-mock'),
    request = require('supertest');

require('chai').should();

describe('Registry server', function () {
  beforeEach(function () {
    this.db = new RedisDb({
      client: redis.createClient()
    });

    this.db.client.flushall();

    this.registry = new Registry({
      db: this.db
    });

    this.registry.initialize();
  });

  describe('GET /packages', function () {
    beforeEach(function () {
      this.db.client.hmset('jquery', 'url', 'git://github.com/jquery/jquery.git', 'name', 'jquery');
    });

    it('should show all avalaible packages', function (done) {
      request(this.registry.server)
        .get('/packages')
        .expect('Content-type', /json/)
        .expect(200, [
          {
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }
        ], done);
    });
  });

  describe('POST /packages', function () {
    describe('if request is correct', function () {
      it('should add the package and return 201', function (done) {
        request(this.registry.server)
          .post('/packages')
          .send({name: 'jquery', url: 'git://github.com/jquery/jquery.git'})
          .expect(201, done);
      });

      it('should add the package and return 201', function (done) {
        request(this.registry.server)
          .post('/packages')
          .send('name=jquery')
          .send('url=git://github.com/jquery/jquery.git')
          .expect(201, done);
      });
    });

    describe('private package', function () {
      it('should return 400 if the registry is not private', function (done) {
        request(this.registry.server)
          .post('/packages')
          .send({name: 'jquery', url: 'git@github.com:jquery/jquery.git'})
          .expect(400, done);
      });

      it('should return 201 if the registry is private', function (done) {
        this.registry.private = true;
        request(this.registry.server)
          .post('/packages')
          .send({name: 'jquery', url: 'git@github.com:jquery/jquery.git'})
          .expect(201, done);
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
        this.db.client.hmset('jquery', 'url', 'git://github.com/jquery/jquery.git', 'name', 'jquery');
      });

      describe('if the name exists', function () {
        it('should return 406', function (done) {
          request(this.registry.server)
            .post('/packages')
            .send({name: 'jquery', url: 'git://github.com/jquery2/jquery2.git'})
            .expect(406, done);
        });
      });

      /*
      // Need a reverse index on redis, so we accept that url is not unique
      describe('if the url exists', function () {
        it('should return 406', function (done) {
          request(this.registry.server)
            .post('/packages')
            .send({name: 'jquery2', url: 'git://github.com/jquery/jquery.git'})
            .expect(406, done);
        });
      });
      */
    });
  });

  describe('GET /packages/:name', function () {
    describe('if the package exists', function () {
      beforeEach(function () {
        this.db.client.hmset('jquery', 'url', 'git://github.com/jquery/jquery.git', 'name', 'jquery');
      });

      it('should return 200 and the package', function (done) {
        request(this.registry.server)
          .get('/packages/jquery')
          .expect(200, {
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }, done);
      });

      it('should do an hit on the package', function (done) {
        request(this.registry.server)
          .get('/packages/jquery')
          .expect(200, {
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }, function () {
            this.db.client.hgetall('jquery', function (err, pkg) {
              pkg.hits.should.equal(1);
              done();
            });
          }.bind(this));
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
      this.db.client.hmset('jquery', 'url', 'git://github.com/jquery/jquery.git', 'name', 'jquery');
    });

    it('should return matching packages', function (done) {
      request(this.registry.server)
        .get('/packages/search/jq')
        .expect(200, [
          {
            name: 'jquery',
            url: 'git://github.com/jquery/jquery.git'
          }
        ], done);
    });
  });

  describe('#listen', function () {
    it('should call server listen', function () {
      var listenSpyCalled = true;

      this.registry.server.listen = function () {
        listenSpyCalled = true;
      };

      this.registry.listen(3000);
      listenSpyCalled.should.be.true;
    });
  });
});