const express = require('express'),
  config = require('./config'),
  routes = require('./routes'),
  bodyParser = require('body-parser'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({name: 'server'}),
  app = express();

const init = async () => {

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  routes(app);

  app.listen(config.rest.port, () => log.info(`Listening on port ${config.rest.port}!`));
};

module.exports = init().catch(e => log.error(e));
