const AWS     = require('aws-sdk');
const ssm     = new AWS.SSM();

let getParams = async () => {
  let req = {
    Names: [ 'foo', 'bar' ],
    WithDecryption: true
  };
  let resp = await ssm.getParameters(req).promise();

  let params = {};
  for (let p of resp.Parameters) {
    params[p.Name] = p.Value;
  }

  return params;
};

module.exports.handler = async (event, context) => {
  let params = await getParams();
  return params;
};