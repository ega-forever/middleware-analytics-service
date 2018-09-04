const Json2csvParser = require('json2csv').Parser;

module.exports = (data)=>{

  const parser = new Json2csvParser({fields: ['blockchain', 'result']});
  return parser.parse(data);

};