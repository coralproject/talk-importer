'use strict';

const h = require('highland'),
  fs = require('fs');

module.exports.readFile = h.wrapCallback(fs.readFile);
