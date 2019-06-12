const middy = require('middy')
const { ssm } = require('middy/middlewares')

const handler = async (event, context) => {
  let resp = {
    foo: process.env.foo,
    bar: process.env.bar,
    jet: process.env.jet,
    pack: process.env.pack,
  }
  return resp
}

module.exports.handler = middy(handler).use(ssm({
  cache: true,
  names: {
    foo: 'foo',
    bar: 'bar',
    jet: 'jet',
    pack: 'pack',
  }
}))