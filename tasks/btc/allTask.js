const BigNumber = require('bignumber.js'),
  _ = require('lodash'),
  allByAddressTask = require('./allByAddressTask');

module.exports = async () => {
  const users = await allByAddressTask();

  return _.chain(users).reduce((result, user)=>{
    return result.plus(user.balance);
  }, BigNumber(0)).thru(balance=>balance.toString()).value();

};
