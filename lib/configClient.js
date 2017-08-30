'use strict';

const co           = require('co');
const EventEmitter = require('events');
const Promise      = require('bluebird');
const AWS          = require('aws-sdk');
const ssm          = Promise.promisifyAll(new AWS.SSM());

const DEFAULT_EXPIRY = 3 * 60 * 1000; // default expiry is 3 mins

function loadConfigs (keys, expiryMs) {
  expiryMs = expiryMs || DEFAULT_EXPIRY; // defaults to 3 mins

  if (!keys || !Array.isArray(keys) || keys.length === 0) {
    throw new Error('you need to provide a non-empty array of config keys');
  }

  if (expiryMs <= 0) {
    throw new Error('you need to specify an expiry (ms) greater than 0, or leave it undefined');
  }

  // the below uses the captured closure to return an object with a gettable 
  // property per config key that on invoke:
  //  * fetch the config values and cache them the first time
  //  * thereafter, use cached values until they expire
  //  * otherwise, try fetching from SSM parameter store again and cache them
  let cache = {
    expiration : new Date(0),
    items      : {}
  };

  let eventEmitter = new EventEmitter();

  let validate = (keys, params) => {
    let missing = keys.filter(k => params[k] === undefined);
    if (missing.length > 0) {
      throw new Error(`missing keys: ${missing}`);
    }
  };

  let reload = co.wrap(function* () {
    console.log(`loading cache keys: ${keys}`);
    
    let req = {
      Names: keys,
      WithDecryption: true
    };
    let resp = yield ssm.getParametersAsync(req);

    let params = {};
    for (let p of resp.Parameters) {
      params[p.Name] = p.Value;
    }

    validate(keys, params);
  
    console.log(`successfully loaded cache keys: ${keys}`);
    let now = new Date();

    cache.expiration = new Date(now.getTime() + expiryMs);
    cache.items = params;

    eventEmitter.emit('refresh');
  });

  let getValue = co.wrap(function* (key) {
    let now = new Date();
    if (now <= cache.expiration) {
      return cache.items[key];
    }
    
    try {
      yield reload();
      return cache.items[key];
    } catch (err) {
      if (cache.items && cache.items.length > 0) {
        // swallow exception if cache is stale, as we'll just try again next time
        console.log('[WARN] swallowing error from SSM Parameter Store:\n', err);

        eventEmitter.emit('refreshError', err);

        return cache.items[key];
      }
      
      console.log(`[ERROR] couldn't fetch the initial configs : ${keys}`);
      console.error(err);

      throw err;
    }
  });
  
  let config = {
    onRefresh      : listener => eventEmitter.addListener('refresh', listener),
    onRefreshError : listener => eventEmitter.addListener('refreshError', listener)
  };
  for (let key of keys) {
    Object.defineProperty(config, key, {
      get: function() { return getValue(key); },
      enumerable: true,
      configurable: false
    });
  }

  return config;
}

module.exports = {
  loadConfigs
};