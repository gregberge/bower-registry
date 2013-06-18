# bower-registry [![Build Status](https://travis-ci.org/neoziro/hulkster.png?branch=master)](https://travis-ci.org/neoziro/hulkster)

Simple bower registry using node and redis.

## How to use

### From command line

```
bower-registry -d redis
```

### In node

```javascript
var bowerRegistry = require('bower-registry'),
    Registry = bowerRegistry.Registry,
    RedisDb = bowerRegistry.RedisDb;

var registry = new Registry({
  db: new RedisDb()
});

registry
  .initialize()
  .listen(3000);
```

## Command line

```
  Usage: bower-registry [options]

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -d, --database <value>    Database
    -o, --db-options [value]  Database options
    -p, --port <value>        Server port
    -h, --host [value]        Server host
```

## License

MIT