const Json2csvParser = require('json2csv').Parser,
  _ = require('lodash');

module.exports = (data) => {

  data = _.chain(data).map(item => {
    return _.get(item, 'result', []).map(resultItem => _.set(resultItem, 'blockchain', item.blockchain))
  }).flattenDeep().value();

  const parser = new Json2csvParser({fields: ['blockchain', 'address', 'balance']});
  return parser.parse(data);

};
