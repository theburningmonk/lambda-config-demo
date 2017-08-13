'use strict';

module.exports.handler = (event, context, callback) => {
  let resp = {
    foo: process.env.foo,
    bar: process.env.bar
  };
  callback(null, resp);
};