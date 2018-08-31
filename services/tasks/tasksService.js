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

  let task = req.params.task;

  let blockchainInTask = _.chain(tasks).toPairs()
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
      result: await item.task(task)
    };
  });


  const file = templates[task](blockchainInTask);

  res.setHeader('Content-disposition', 'attachment; filename=CoinTotalBalance.csv');
  res.setHeader("content-type", "text/csv");
  res.send(file);

};