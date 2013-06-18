var program = require('commander'),
    Registry = require('../lib/registry').Registry,
    RedisDb = require('../lib/db/redis').RedisDb;

var json = function (str) {
  return JSON.parse(str);
};

program
  .version('0.0.1')
  .option('-d, --database <value>', 'Database')
  .option('-o, --db-options [value]', 'Database options', json)
  .option('-p, --port <value>', 'Server port', 80)
  .option('-h, --host [value]', 'Server host');


// Create a new db driver from a database name and options
var dbDriverFactory = function (database, options) {
  switch (database) {
  case 'redis':
    return new RedisDb(options);
  }

  throw 'unknown database ' + database;
};

// Run command line
var run = function (args) {
  program.parse(args);

  var registry = new Registry({
    db: dbDriverFactory(program.database, program.dbOptions)
  });

  registry
    .initialize()
    .listen(program.port, program.host);
};

exports.run = run;
exports.program = program;