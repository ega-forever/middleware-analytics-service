require('dotenv').config();

module.exports = {
  mongo: {
    eth: {
      accounts: {
        uri: process.env.MONGO_ETH_ACCOUNTS_URI || process.env.MONGO_ETH_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/data',
        collectionPrefix: process.env.MONGO_ETH_ACCOUNTS_COLLECTION_PREFIX || process.env.MONGO_COLLECTION_PREFIX || 'eth'
      },
      data: {
        uri: process.env.MONGO_ETH_DATA_URI || process.env.MONGO_ETH_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/data',
        collectionPrefix: process.env.MONGO_ETH_DATA_COLLECTION_PREFIX || process.env.MONGO_COLLECTION_PREFIX || 'eth'
      }
    },
    btc: {
      accounts: {
        uri: process.env.MONGO_BTC_ACCOUNTS_URI || process.env.MONGO_BTC_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/data',
        collectionPrefix: process.env.MONGO_BTC_ACCOUNTS_COLLECTION_PREFIX || process.env.MONGO_COLLECTION_PREFIX || 'bitcoin'
      },
      data: {
        uri: process.env.MONGO_BTC_DATA_URI || process.env.MONGO_BTC_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/data',
        collectionPrefix: process.env.MONGO_BTC_DATA_COLLECTION_PREFIX || process.env.MONGO_COLLECTION_PREFIX || 'bitcoin'
      }
    }
  },
  nodes: {
    eth: 'http://localhost:8545'
  },
  rest: {
    port: parseInt(process.env.REST_PORT) || 8080
  }
};
