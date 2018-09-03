const _ = require('lodash'),
  Promise = require('bluebird'),
  BigNumber = require('bignumber.js'),
  models = require('../../models/eth');

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

  let sums = await Promise.mapSeries(_.range(0, countUsers, LIMIT), async startAccount => {
    const accounts = await models.accountModel.find({}).select('address').skip(startAccount).limit(LIMIT);

    let values = await models.txModel.aggregate([
      {
        $match: {
          to: {
            $in: accounts.map(acc => acc.address)
          },
          value: {$nin: [0, '0']}
        }
      },
      {
        $lookup: {
          from: 'ethblocks',
          localField: 'blockNumber',
          foreignField: 'number',
          as: 'block'
        }
      },
      {$unwind: '$block'},
      {
        $match: {
          $and: [
            {'block.timestamp': {$lte: parseInt(end / 1000)}},
            {'block.timestamp': {$gte: parseInt(start / 1000)}}
          ]

        }
      },
      {
        $project: {
          value: '$value'
        }
      }
    ]);

    return sumCoins(values);
  });

  return sumNumbers(sums);
};
