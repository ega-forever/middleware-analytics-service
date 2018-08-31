const requireAll = require('require-all'),
  _ = require('lodash'),
  models = requireAll({
    dirname: __dirname,
    filter: /(.+Model)\.js$/
  });

/** @function
 * @description prepare (init) the mongoose models
 *
 */

const initAccounts = (connection, prefix) => {

  ctx.accountModel = models.accountModel(connection, prefix);

};

const initData = (connection, prefix) =>{

  const modelNames = _.pull(Object.keys(models), 'accountModel');

  for (let modelName of modelNames)
    ctx[modelName] = models[modelName](connection, prefix);

};

const ctx = {
  initAccounts: initAccounts,
  initData: initData
};

/** @factory
 * @return {{init: init, ...Models}}
 */

module.exports = ctx;
