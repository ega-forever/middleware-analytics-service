const models = require('../../models/eth'),
  _ = require('lodash'),
  config = require('../../config'),
  Web3 = require('web3'),
  Promise = require('bluebird');

const LIMIT = 100;

module.exports = async () => {

  const web3 = new Web3(config.nodes.eth);

  let countUsers = await models.accountModel.count();

  let users = await Promise.mapSeries(_.range(0, countUsers, LIMIT), async startAccount => {
    const accounts = await models.accountModel.find({}).select('address').skip(startAccount).limit(LIMIT);

    return await Promise.mapSeries(accounts, async account => {

      const address = account.address.toLowerCase();
      const balance = await web3.eth.getBalance(address);


      return {
        address: address,
        balance: balance
      }

    });
  });


  if (web3.currentProvider.connection)
    web3.currentProvider.connection.close();

  return _.flattenDeep(users);
};
