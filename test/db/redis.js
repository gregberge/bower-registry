/*jshint undef:false, expr:true, strict:false */

var RedisDb = require('../../index').RedisDb,
    redis = require('redis-mock');

require('chai').should();

describe('RedisDb', function () {
  beforeEach(function () {
    this.db = new RedisDb({
      client: redis.createClient()
    });

    this.db.client.flushall();
  });

  describe('#find', function () {
    beforeEach(function () {
      this.packages = [
        {
          name: 'jquery',
          url: 'git://github.com/jquery/jquery.git'
        },
        {
          name: 'jqlite',
          url: 'git://github.com/jquery/jqlite.git'
        }
      ];

      var client = this.db.client,
          packages = this.packages;

      client.hmset(packages[0].name, 'url', packages[0].url, 'name', packages[0].name);
      client.hmset(packages[1].name, 'url', packages[1].url, 'name', packages[1].name);
    });

    describe('without arguments', function () {
      it('should return all packages', function (done) {
        this.db.find().then(function (packages) {
          packages.should.deep.equal(this.packages);
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
      beforeEach(function () {
        this.db.client.hmset('jquery', 'url', 'git://jquery.git', 'name', 'jquery');
      });

      it('should return an error', function (done) {
        this.db.add({
          name: 'jquery',
          url: 'git://github.com/jquery2/jquery2.git'
        }).then(function () {}, function () {
          done();
        });
      });
    });


    it('should add the package', function (done) {
      this.db.add({
        name: 'jquery',
        url: 'git://github.com/jquery/jquery.git'
      }).then(function () {
        this.db.client.hgetall('jquery', function (err, res) {
          res.should.not.be.null;
          done();
        });
      }.bind(this));
    });
  });

  describe('#hit', function () {
    beforeEach(function () {
      this.db.client.hmset('jquery', 'url', 'git://jquery.git', 'name', 'jquery');
    });

    it('should increment package hit value', function (done) {
      this.db.hit('jquery').then(function () {
        this.db.client.hgetall('jquery', function (err, pkg) {
          pkg.hits.should.equal(1);
          done();
        });
      }.bind(this));
    });
  });

});