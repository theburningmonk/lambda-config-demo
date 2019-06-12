const middy = require('middy')
const { ssm } = require('middy/middlewares')

const handler = async (event, context) => {
  let resp = {
    foo: process.env.FOO,
    bar: process.env.BAR,
    jet: process.env.JET,
    pack: process.env.PACK,
  }
  return resp
}

module.exports.handler = middy(handler).use(ssm({
  cache: true,
  names: {
    FOO: 'foo',
    BAR: 'bar',
    JET: 'jet',
    PACK: 'pack',
  }
}))