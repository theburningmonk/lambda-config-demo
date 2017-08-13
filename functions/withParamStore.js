'use strict';

const co      = require('co');
const Promise = require('bluebird');
const AWS     = require('aws-sdk');
const ssm     = Promise.promisifyAll(new AWS.SSM());

let getParams = co.wrap(function* () {
  let req = {
    Names: [ 'foo', 'bar' ],
    WithDecryption: true
  };
  let resp = yield ssm.getParametersAsync(req);

  let params = {};
  for (let p of resp.Parameters) {
    params[p.Name] = p.Value;
  }

  return params;
});

module.exports.handler = co.wrap(function* (event, context, callback) {
  let params = yield getParams();
  callback(null, params);
});