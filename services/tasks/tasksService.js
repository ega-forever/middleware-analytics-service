const path = require('path'),
  _ = require('lodash'),
  templates = require('../../templates'),
  Promise = require('bluebird'),
  tasks = require('require-all')({
    dirname: path.join(__dirname, '../../tasks'),
    filter: /(index)\.js$/,
    recursive: true,
    map: name => name.replace('Task', '')
  });

module.exports = async (req, res) => {

  let task = req.params.task.toLowerCase();

  let blockchainInTask = _.chain(req.params.blockchain ? _.pick(tasks, req.params.blockchain) : tasks).toPairs()
    .map(pair => {
      return {
        blockchain: pair[0],
        task: pair[1].index
      }
    })
    .value();


  blockchainInTask = await Promise.mapSeries(blockchainInTask, async item=>{
    return {
      blockchain: item.blockchain,
      result: await item.task(task, req.query.args)
    };
  });


  const file = templates[task](blockchainInTask);

  res.setHeader('Content-disposition', 'attachment; filename=CoinTotalBalance.csv');
  res.setHeader("content-type", "text/csv");
  res.send(file);

};