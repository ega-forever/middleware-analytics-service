const _ = require('lodash'),
  BigNumber = require('bignumber.js'),
  allTokensByAddressTask = require('./allTokensByAddressTask');

module.exports = async () => {

  const users = await allTokensByAddressTask();

  return _.chain(users)
    .map(item=>item.tokens)
    .flattenDeep()
    .groupBy('symbol')
    .toPairs()
    .transform((result, pair)=>{

      let symbol = pair[0];
      let items = pair[1];

      if(!result[symbol])
        result[symbol] = BigNumber(0);

      for(let item of items)
        result[symbol] = result[symbol].plus(item.balance)

      return result;
    }, {})
    .toPairs()
    .map(pair=> {
      pair[1] = pair[1].toString();
      return pair;
    })
    .fromPairs()
    .value();

/*  return _.chain(users).reduce((result, user)=>{
    return result.plus(user.balance);
  }, BigNumber(0)).thru(balance=>balance.toString()).value();
  */
};
