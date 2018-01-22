const h = require('highland');
const fs = require('fs');

module.exports.readFile = h.wrapCallback(fs.readFile);
