/*jshint undef:false, expr:true, strict:false */

var cli = require('../lib/cli'),
    program = cli.program,
    run = cli.run,
    redis = require('redis-mock'),
    Registry = require('../lib/registry').Registry;

require('chai').should();

describe('CLI', function () {
  describe('Program', function () {
    describe('Database', function () {
      it('should parse database', function () {
        // long
        program.parse('node bower-registry --database redis'.split(' '));
        program.database.should.equal('redis');

        // short
        program.parse('node bower-registry -d mysql'.split(' '));
        program.database.should.equal('mysql');
      });
    });

    describe('Database options', function () {
      it('should parse database options', function () {
        program.parse(['node', 'bower-registry', '-o', '{"host": "127.0.0.1", "port": 6379}']);
        program.dbOptions.should.deep.equal({
          host: '127.0.0.1',
          port: 6379
        });
      });
    });

    describe('Private', function () {
      it('should parse private', function () {
        // long
        program.parse('node bower-registry -d mysql --private'.split(' '));
        program.private.should.be.true;

        // short
        program.parse('node bower-registry -d mysql -P'.split(' '));
        program.private.should.be.true;
      });
    });
  });

  describe('#run', function () {

    describe('with a valid database and a port', function () {
      it('should listen on specified port', function () {
        var called = false;

        // Registry listen spy
        Registry.prototype.listen = function () {
          called = true;
        };

        // Inject redis mock client
        program.dbOptions = {
          client: redis.createClient()
        };

        run(['node', 'bower-registry', '--database', 'redis', '--port', '3000']);

        called.should.be.true;
      });
    });
  });

});