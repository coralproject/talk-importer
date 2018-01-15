'use strict';

const h = require('highland');

/**
 * We're dealing with Buffers which are just strings
 * of JSON.
 *
 * - Turn the Buffer to a String
 * - Split on new lines
 * - Compact removes any falsy values
 * - Parse each lines
 */
module.exports.parseFileStream = h.pipeline(
  h.map(buf => buf.toString('utf-8')),
  h.split(),
  h.compact(),
  h.map(JSON.parse)
);
