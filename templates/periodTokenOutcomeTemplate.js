const Json2csvParser = require('json2csv').Parser,
  _ = require('lodash');

module.exports = (data) => {

  data = _.chain(data).map(item =>
    _.chain(item).get('result', {}).toPairs()
      .map(pair => ({
        token: pair[0],
        blockchain: item.blockchain,
        balance: pair[1]
      }))
      .value()
  ).flattenDeep().value();

  const parser = new Json2csvParser({fields: ['blockchain', 'token', 'balance']});
  return parser.parse(data);

};