const config = require('../../config'),
  models = require('../../models/btc'),
  allTask = require('./allTask'),
  allByAddress = require('./allByAddressTask'),
  mongoose = require('mongoose');

module.exports = async (taskId) => {

  const taskMap = {
    all: allTask,
    allbyaddress: allByAddress
  };

  if (!taskMap[taskId])
    return;

  const accountsConnection = mongoose.createConnection(config.mongo.btc.accounts.uri, {useNewUrlParser: true});
  const dataConnection = mongoose.createConnection(config.mongo.btc.accounts.uri, {useNewUrlParser: true});

  models.initAccounts(accountsConnection, config.mongo.btc.accounts.collectionPrefix);
  models.initData(dataConnection, config.mongo.btc.data.collectionPrefix);


  const reply = await taskMap[taskId]();

  accountsConnection.close();
  dataConnection.close();

  return reply;

};
