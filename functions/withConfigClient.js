'use strict';

const co           = require('co');
const configClient = require('../lib/configClient');

const config = configClient.loadConfigs(
  [ "foo", "bar" ], 
  30000); // cache config values for 30s

module.exports.handler = co.wrap(function* (event, context, callback) {
  let params = [ yield config.foo, yield config.bar ];
  callback(null, params);
});