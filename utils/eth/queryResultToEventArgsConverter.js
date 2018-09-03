const _ = require('lodash'),
  BigNumber = require('bignumber.js'),
  TokenContract = require('../../factories/eth/erc20/TokenContract');

const eventDefinition = _.chain(TokenContract).get('networks')
  .toPairs()
  .map(pair => pair[1].events)
  .flattenDeep()
  .transform((result, ev) => _.merge(result, ev))
  .toPairs()
  .find(pair => pair[1].name === 'Transfer')
  .thru(pair => {
    pair[1].signature = pair[0];
    return pair[1];
  })
  .value();


const getTopic = arg => {
  let bn = BigNumber();
  bn.s = 1;
  bn.c = arg.c;
  bn.e = arg.e;
  let topic = bn.toString(16);
  while (topic.length < 40)
    topic = '0' + topic;
  return '0x' + topic;
};


const converter = (queryResults) => {


  let indexedInputs = _.filter(eventDefinition.inputs, {indexed: true});

  let indexedMap =  _.chain(eventDefinition.inputs)
      .transform((result, item, index) => {

        if (item.indexed) {
          let origIndex = _.findIndex(indexedInputs, item);
          result[origIndex] = index;
        } else {
          let origIndex = _.chain(eventDefinition.inputs)
            .filter({indexed: false})
            .findIndex(item)
            .value() + indexedInputs.length;

          result[origIndex] = index;
        }

      }, {})
      .value();

  return queryResults
    .map(item =>
    _.chain(item.args)
      .map((arg, index) => {
        let topicIndex = indexedMap[index];


        const definition = eventDefinition.inputs[topicIndex];
        if (!definition)
          return {};


        let value = _.isString(arg) ? arg : getTopic(arg);

        if (new RegExp(/uint/).test(definition.type))
          value = BigNumber(value, 16);

        return {[definition.name]: value};

      })
      .transform((result, value) => _.merge(result, value), {})
      .merge({
        event: {
          name: eventDefinition.name,
          signature: item.signature,
          address: item.address
        },
        includedIn: {
          blockNumber: item.blockNumber,
          txIndex: item.txIndex,
          logIndex: item.index
        }
      })
      .value()
  );

};


module.exports = converter;
