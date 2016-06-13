/*jshint undef:false, expr:true, strict:false */

var Q = require('q'),
    MongoDb = require('../../index').MongoDb,
    mockgo = require('mockgo'),
    expect = require('chai').expect;

require('chai').should();

describe('MongoDb', function () {
  var connection, db;
  this.timeout(0);

  function connect(done) {
    mockgo.getConnection(function(error, _connection) {
      expect(error).to.be.null;
      connection = _connection;
      db = new MongoDb({
        url: 'mongodb://localhost:8000/testDatabase',
        client: Q.when(connection)
      });
      done();
    });
  }

  function disconnect(done) {
    mockgo.shutDown(done);
  }

  describe('#find', function () {
    var packages;

    before(connect);
    after(disconnect);

    beforeEach(function () {
      packages = [
        {
          name: 'jquery',
          url: 'git://github.com/jquery/jquery.git'
        },
        {
          name: 'jqlite',
          url: 'git://github.com/jquery/jqlite.git'
        }
      ];

      connection.collection('packages').updateOne(packages[0], { $set: packages[0] }, {upsert: true});
      connection.collection('packages').updateOne(packages[1], { $set: packages[1] }, {upsert: true});
    });

    describe('without arguments', function () {
      it('should return all packages', function (done) {
        db.find().then(function (packages) {
          packages.forEach(function (package, i) {
            package.should.have.property('name', packages[i].name);
            package.should.have.property('url', packages[i].url);
          });
          done();
        });
      });
    });

    describe('with a hash matching one value', function () {
      it('should return packages matching the query', function (done) {
        db.find({
          name: 'jquery'
        }).then(function (packages) {
          packages[0].should.have.property('name', 'jquery');
          packages[0].should.have.property('url', 'git://github.com/jquery/jquery.git');
          done();
        });
      });
    });

    describe('with a hash matching 0 value', function () {
      it('should not return packages', function (done) {
        db.find({
          name: 'jquery2'
        }).then(function (packages) {
          packages.length.should.equal(0);
          done();
        });
      });
    });

    describe('with a hash with "$match" operator', function () {
      it('should return packages matching the query', function (done) {
        db.find({
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
    before(connect);
    after(disconnect);

    describe('if package exist', function () {
      before(function () {
        connection.collection('packages').update({name: 'jquery'}
          , { $set: {url: 'git://jquery.git', name: 'jquery'} }, {upsert: true});
      });

      it('should return an error', function (done) {
        db.add({
          name: 'jquery',
          url: 'git://github.com/jquery2/jquery2.git'
        }).then(function () {}, function () {
          done();
        });
      });
    });


    it('should add the package', function (done) {
      db.add({
        name: 'jquery',
        url: 'git://github.com/jquery/jquery.git'
      }).then(function () {
        connection.collection('packages').findOne({name: 'jquery'}, function(err, res) {
          expect(res).not.to.be.null;
          done();
        });
      });
    });
  });

  describe('#hit', function () {
    before(connect);
    after(disconnect);

    beforeEach(function () {
      connection.collection('packages').update({name: 'jquery'}
        , { $set: {url: 'git://jquery.git', name: 'jquery'} }, {upsert: true});
    });

    it('should increment package hit value', function (done) {
      db.hit('jquery').then(function () {
        connection.collection('packages').findOne({name: 'jquery'}, function(err, pkg) {
          pkg.hits.should.equal(1);
          done();
        });
      });
    });
  });

});