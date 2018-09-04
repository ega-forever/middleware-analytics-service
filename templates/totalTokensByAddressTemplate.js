const Json2csvParser = require('json2csv').Parser,
  _ = require('lodash');

module.exports = (data) => {

  data = _.chain(data).map(item =>
    _.chain(item).get('result', []).map(resultItem =>
      resultItem.tokens.map(token => ({
        address: resultItem.address,
        blockchain: item.blockchain,
        token: token.symbol,
        balance: token.balance
      }))
    ).value()
  ).flattenDeep().value();

  const parser = new Json2csvParser({fields: ['blockchain', 'address', 'token', 'balance']});
  return parser.parse(data);

};
