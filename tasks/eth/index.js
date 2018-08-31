const config = require('../../config'),
  models = require('../../models/eth'),
  allTask = require('./AllTask'),
  allByAddress = require('./AllByAddressTask'),
  allTokensByAddressTask = require('./AllTokensByAddressTask'),
  allTokensTask = require('./AllTokensTask'),
  mongoose = require('mongoose');

module.exports = async (taskId) => {

  const taskMap = {
    all: allTask,
    allbyaddress: allByAddress,
    alltokensbyaddress: allTokensByAddressTask,
    alltokens: allTokensTask
  };

  if (!taskMap[taskId])
    return;

  const accountsConnection = mongoose.createConnection(config.mongo.eth.accounts.uri, {useNewUrlParser: true});
  const dataConnection = mongoose.createConnection(config.mongo.eth.accounts.uri, {useNewUrlParser: true});

  models.initAccounts(accountsConnection, config.mongo.eth.accounts.collectionPrefix);
  models.initData(dataConnection, config.mongo.eth.data.collectionPrefix);


  const reply = await taskMap[taskId]();

  accountsConnection.close();
  dataConnection.close();

  return reply;

};
