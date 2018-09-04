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


module.exports = async (start, end) => {

  let countUsers = await models.accountModel.count();

  let userSums = await Promise.mapSeries(_.range(0, countUsers, LIMIT), async startAccount => {
    const accounts = await models.accountModel.find({}).select('address').skip(startAccount).limit(LIMIT);

    const condition = [
      {
        $match: {
          address: {
            $in: accounts.map(acc => acc.address)
          }
        }
      },
      {
        $lookup: {
          from: 'bitcoinblocks',
          localField: 'outputBlock',
          foreignField: 'number',
          as: 'outputBlock'
        }
      },
      {$unwind: '$outputBlock'},
      {
        $match: {
          $and: [
            {'outputBlock.timestamp': {$gte: parseInt(start / 1000)}},
            {'outputBlock.timestamp': {$lte: parseInt(end / 1000)}}
          ]
        }
      }
    ];

    const clonedCondition = _.cloneDeep(condition);
    clonedCondition.push({$count: 'count'});

    let countCoins = await models.coinModel.aggregate(clonedCondition);
    countCoins = _.get(countCoins, '0.count', 0);

    const sums = await Promise.mapSeries(_.range(0, countCoins, LIMIT), async startCoin => {

      const clonedCondition = _.cloneDeep(condition);
      clonedCondition.push({$skip: startCoin});
      clonedCondition.push({$limit: LIMIT});
      clonedCondition.push({
        $project: {
          value: '$value'
        }
      });

      const coins = await models.coinModel.aggregate(condition);
      return sumCoins(coins);
    });

    return sumNumbers(sums)

  });

  return sumNumbers(userSums);
};
