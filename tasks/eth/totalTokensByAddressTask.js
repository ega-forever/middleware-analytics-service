const models = require('../../models/eth'),
  _ = require('lodash'),
  config = require('../../config'),
  Web3 = require('web3'),
  transferEventToQueryConverter = require('../../utils/eth/transferEventToQueryConverter'),
  erc20tokenDefinition = require('../../factories/eth/erc20/TokenContract.json'),
  Promise = require('bluebird');

const LIMIT = 100;

module.exports = async () => {

  const web3 = new Web3(config.nodes.eth);

  let countUsers = await models.accountModel.count();

  let users = await Promise.mapSeries(_.range(0, countUsers, LIMIT), async startAccount => {
    const accounts = await models.accountModel.find({}).select('address').skip(startAccount).limit(LIMIT);

    return await Promise.mapSeries(accounts, async account => {

      const address = account.address.toLowerCase();

      const query = transferEventToQueryConverter({
        $or: [{to: address}, {from: address}]
      });

      let tokens = await models.txLogModel.distinct('address', query);

      tokens = await Promise.mapSeries(tokens, async token => {
        const contractInstance = new web3.eth.Contract(erc20tokenDefinition.abi, token);
        let balance = await contractInstance.methods.balanceOf(address).call();
        let symbol = await contractInstance.methods.symbol().call();

        return {
          symbol: symbol,
          address: token,
          balance: balance.toString()
        };
      });

      return {
        address: address,
        tokens: tokens
      }

    });
  });


  return _.flattenDeep(users);
};
