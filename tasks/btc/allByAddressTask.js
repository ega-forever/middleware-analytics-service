const models = require('../../models/btc'),
  _ = require('lodash'),
  BigNumber = require('bignumber.js'),
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

const sumNumbers = (sums) => {
  return _.chain(sums)
    .reduce((genSum, sum) =>
      genSum.plus(sum), new BigNumber(0))
    .thru(bigNumber => bigNumber.toNumber())
    .value();
};


module.exports = async () => {

  let countUsers = await models.accountModel.count();

  let users = await Promise.mapSeries(_.range(0, countUsers, LIMIT), async startAccount => {
    const accounts = await models.accountModel.find({}).select('address').skip(startAccount).limit(LIMIT);

    return await Promise.mapSeries(accounts, async account => {

      const condition = {
        address: {
          $in: account.address
        },
        inputBlock: {
          $exists: false
        }
      };

      const countCoins = await models.coinModel.count(condition);

      const sums = await Promise.mapSeries(_.range(0, countCoins, LIMIT), async startCoin => {
        const coins = await models.coinModel.find(condition).select('value').skip(startCoin).limit(LIMIT);
        return sumCoins(coins);
      });

      return {
        address: account.address,
        balance: sumNumbers(sums)
      }

    });
  });

  return _.flattenDeep(users);
};
