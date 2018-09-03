const models = require('../../models/eth'),
  _ = require('lodash'),
  config = require('../../config'),
  Web3 = require('web3'),
  BigNumber = require('bignumber.js'),
  erc20tokenDefinition = require('../../factories/eth/erc20/TokenContract.json'),
  transferEventToQueryConverter = require('../../utils/eth/transferEventToQueryConverter'),
  queryResultToEventArgsConverter = require('../../utils/eth/queryResultToEventArgsConverter'),
  Promise = require('bluebird');

const LIMIT = 100;

const sumCoins = (coins) => {
  return _.chain(coins)
    .reduce((sum, coin) => {
      return sum.plus(coin.value);
    }, new BigNumber(0))
    .thru(bigNumber => bigNumber.toNumber())
    .value();
};

module.exports = async () => {

  const web3 = new Web3(config.nodes.eth);

  let countUsers = await models.accountModel.count();

  let tokens = await Promise.mapSeries(_.range(0, countUsers, LIMIT), async startAccount => {
    const accounts = await models.accountModel.find({}).select('address').skip(startAccount).limit(LIMIT);

    return await Promise.mapSeries(accounts, async account => {

      const address = account.address.toLowerCase();
      const query = transferEventToQueryConverter({to: address});

      let tokens = await models.txLogModel.find(query);
      tokens = queryResultToEventArgsConverter(tokens);

      return _.chain(tokens)
        .groupBy('event.address')
        .toPairs()
        .map(pair => {
          pair[1] = sumCoins(pair[1]);
          return pair;
        })
        .fromPairs()
        .value();
    });
  });


  tokens = _.chain(tokens)
    .flattenDeep()
    .reject(token => _.isEmpty(token))
    .transform((result, item) => {
      _.chain(item).toPairs().forEach(pair => {
        result[pair[0]] = (result[pair[0]] || BigNumber(0)).plus(pair[1]);
      }).value();
    })
    .toPairs()
    .map(pair => {
      pair[1] = pair[1].toString();
      return pair;
    })
    .fromPairs()
    .value();

  let tokenPairs = await Promise.mapSeries(_.toPairs(tokens), async pair=>{
    const contractInstance = new web3.eth.Contract(erc20tokenDefinition.abi, pair[0]);
    let symbol = await contractInstance.methods.symbol().call();
    return [symbol, pair[1]];
  });


  return _.fromPairs(tokenPairs);

};
