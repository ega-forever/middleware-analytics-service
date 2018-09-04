const config = require('../../config'),
  models = require('../../models/eth'),
  requireAll = require('require-all'),
  taskMap = requireAll({
    dirname: __dirname,
    filter: /(.+Task)\.js$/,
    map: task=>task.replace('Task', '').toLowerCase()
  }),
  mongoose = require('mongoose');

module.exports = async (taskId, args = []) => {

  taskId = taskId.toLowerCase();

  if (!taskMap[taskId])
    return;

  const accountsConnection = mongoose.createConnection(config.mongo.eth.accounts.uri, {useNewUrlParser: true});
  const dataConnection = mongoose.createConnection(config.mongo.eth.accounts.uri, {useNewUrlParser: true});

  models.initAccounts(accountsConnection, config.mongo.eth.accounts.collectionPrefix);
  models.initData(dataConnection, config.mongo.eth.data.collectionPrefix);


  const reply = await taskMap[taskId](...args);

  accountsConnection.close();
  dataConnection.close();

  return reply;

};
