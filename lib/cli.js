var program = require('commander'),
    Registry = require('../lib/registry').Registry,
    RedisDb = require('../lib/db/redis').RedisDb,
    pkg = require('../package.json');

var json = function (str) {
  return JSON.parse(str);
};

program
  .version(pkg.version)
  .option('-d, --database <value>', 'Database')
  .option('-o, --db-options [value]', 'Database options', json)
  .option('-p, --port <value>', 'Web server port', 80)
  .option('-h, --host [value]', 'Web server host')
  .option('-P, --private', 'Accept private packages');


// Create a new db driver from a database name and options
var dbDriverFactory = function (database, options) {
  if (! database)
    program.help();

  switch (database) {
  case 'redis':
    return new RedisDb(options);
  }

  console.log('Error, you must choose a database from this list: redis');
  process.exit(1);
};

// Run command line
var run = function (args) {
  program.parse(args);

  var registry = new Registry({
    db: dbDriverFactory(program.database, program.dbOptions),
    private: program.private
  });

  registry
    .initialize()
    .listen(program.port, program.host);
};

exports.run = run;
exports.program = program;