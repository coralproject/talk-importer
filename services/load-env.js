const fs = require('fs'),
  dotenv = require('dotenv'),
  path = require('path'),
  ENV_PATH = path.join(__dirname, '..', '.env');

module.exports = function () {
  let envConfig = dotenv.parse(fs.readFileSync(ENV_PATH, {
    encoding: 'utf8'
  }));

  Object.keys(envConfig).forEach((k) => {
    process.env[k] = envConfig[k];
  });
};
