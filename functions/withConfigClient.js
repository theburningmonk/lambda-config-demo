'use strict';

const co           = require('co');
const configClient = require('../lib/configClient');

const config1 = configClient.loadConfigs(
  [ "foo", "bar" ], 
  30000); // cache config values for 30s

const config2 = configClient.loadConfigs(
  [ "jet", "pack" ]); // default cache expiration is 3 mins

module.exports.handler = co.wrap(function* (event, context, callback) {
  let params = [ 
    yield config1.foo, 
    yield config1.bar,
    yield config2.jet,
    yield config2.pack
  ];
  callback(null, params);
});