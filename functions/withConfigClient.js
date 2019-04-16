const configClient = require('../lib/configClient');

const config1 = configClient.loadConfigs(
  [ "foo", "bar" ], 
  30000); // cache config values for 30s

const config2 = configClient.loadConfigs(
  [ "jet", "pack" ]); // default cache expiration is 3 mins

module.exports.handler = async (event, context) => {
  let params = [ 
    await config1.foo, 
    await config1.bar,
    await config2.jet,
    await config2.pack
  ];
  return params;
};