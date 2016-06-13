# bower-registry

# This plugin is no longer actively maintained, you can still use it but issues will not be resolved. If you want the npm name, you can contact me by email.

[![Build Status](https://travis-ci.org/neoziro/bower-registry.svg?branch=master)](https://travis-ci.org/neoziro/bower-registry)
[![Dependency Status](https://david-dm.org/neoziro/bower-registry.svg?theme=shields.io)](https://david-dm.org/neoziro/bower-registry)
[![devDependency Status](https://david-dm.org/neoziro/bower-registry/dev-status.svg?theme=shields.io)](https://david-dm.org/neoziro/bower-registry#info=devDependencies)

Simple bower registry using node and either redis or MongoDB.

## Install

```
npm install -g bower-registry
```

## How to use

### From command line

```
bower-registry -d redis
```

### In node

```javascript
var bowerRegistry = require('bower-registry'),
    Registry = bowerRegistry.Registry,
    RedisDb = bowerRegistry.RedisDb; // or MongoDb

var registry = new Registry({
  db: new RedisDb() // or MongoDb
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
    -p, --port <value>        Web server port
    -h, --host [value]        Web server host
    -P, --private             Accept private packages and allow packages hosted on private servers
```

### Examples

```bash
# Start registry server on port 8080 using redis (port 6379, host 127.0.0.1)
bower-registry -p 8080 -d redis -o '{"port": 6379, "host": "127.0.0.1"}'

# Start registry server on default port 80 using MongoDB (port 27017, host 127.0.0.1)
bower-registry -d mongo -o '{"url": "mongodb://127.0.0.1:27017/bower-registry"}'
```

NOTE: On Windows you've to use a double-quoted database options string and therefore have to escape the double quotes with a \ in the JSON string in case you use cmd.exe as interpreter. Using powershell.exe, use single quotes and escape each double quote with an extra double quote in the JSON string.
## Database options

### Redis

* `port`: redis instance port
* `host`: redis instance host
* other options available in [node_redis](https://github.com/mranney/node_redis#rediscreateclientport-host-options)

### MongoDB

* `url`: MongoDB connection URL
* other options available in [node-mongodb-native](https://github.com/mongodb/node-mongodb-native/blob/2.0/lib/mongo_client.js#L74-299)

## License

MIT
