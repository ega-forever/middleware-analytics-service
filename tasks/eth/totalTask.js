const BigNumber = require('bignumber.js'),
  _ = require('lodash'),
  totalByAddressTask = require('./totalByAddressTask');

module.exports = async () => {
  const users = await totalByAddressTask();

  return _.chain(users).reduce((result, user)=>{
    return result.plus(user.balance);
  }, BigNumber(0)).thru(balance=>balance.toString()).value();

};
