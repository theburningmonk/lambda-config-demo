module.exports.handler = async (event, context) => {
  let resp = {
    foo: process.env.foo,
    bar: process.env.bar
  }
  return resp
}