module.exports = require('require-all')({
  dirname: __dirname,
  filter: /(.+Template)\.js$/,
  map: name => name.replace('Template', '').toLowerCase()
});