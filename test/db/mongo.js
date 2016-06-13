/*jshint undef:false, expr:true, strict:false */

var Q = require('q'),
    MongoDb = require('../../index').MongoDb,
    mockgo = require('mockgo'),
    should = require('chai').should();

describe('MongoDb', function () {
  beforeEach(function (done) {
    var defer = Q.defer();
    mockgo.getConnection(function(err, db) {
      if (err) {
        return defer.reject();
      }

      defer.resolve(db);
      done();
    });
    this.db = new MongoDb({
      url: 'mongodb://localhost:8000/testDatabase',
      client: defer.promise
    });
  });

  afterEach(function (done) {
    mockgo.shutDown(done);
  });

  describe('#find', function () {
    beforeEach(function (done) {
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
      client.then(function (db) {
        db.collection('packages').updateOne(packages[0], { $set: packages[0] }, {upsert: true});
        db.collection('packages').updateOne(packages[1], { $set: packages[1] }, {upsert: true});
        done();
      });
    });

    describe('without arguments', function () {
      it('should return all packages', function (done) {
        this.db.find().then(function (packages) {
          packages.forEach(function (package, i) {
            package.should.have.property('name', this.packages[i].name);
            package.should.have.property('url', this.packages[i].url);
          }.bind(this));
          done();
        }.bind(this));
      });
    });

    describe('with a hash matching one value', function () {
      it('should return packages matching the query', function (done) {
        this.db.find({
          name: 'jquery'
        }).then(function (packages) {
          packages[0].should.have.property('name', 'jquery');
          packages[0].should.have.property('url', 'git://github.com/jquery/jquery.git');
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
      beforeEach(function (done) {
        var client = this.db.client;
        client.then(function (db) {
          db.collection('packages').update({name: 'jquery'}
            , { $set: {url: 'git://jquery.git', name: 'jquery'} }, {upsert: true});
          done();
        });
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
        this.db.client.then(function (db) {
          db.collection('packages').findOne({name: 'jquery'}, function(err, res) {
            should.exist(res);
            done();
          });
        });
      }.bind(this));
    });
  });

  describe('#hit', function () {
    beforeEach(function () {
      this.db.client.then(function (db) {
        db.collection('packages').update({name: 'jquery'}
          , { $set: {url: 'git://jquery.git', name: 'jquery'} }, {upsert: true});
        done();
      });
    });

    it('should increment package hit value', function (done) {
      this.db.hit('jquery').then(function () {
        this.db.client.then(function (db) {
          db.collection('packages').findOne({name: 'jquery'}, function(err, pkg) {
            pkg.hits.should.equal(1);
            done();
          });
        });
      }.bind(this));
    });
  });

});