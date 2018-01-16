'use strict';

const h = require('highland'),
  { file, concurrency = 10 } = require('yargs').argv,
  { parseFileStream } = require('./services/pipelines'),
  { translateAsset } = require('./services/translations'),
  { readFile } = require('./services/fs'),
  { assetService } = require('./services/talk-services');

h.of(file)
  .flatMap(readFile)
  .pipe(parseFileStream)
  .map(translateAsset)
  .map(saveAsset)
  .parallel(concurrency)
  .errors(logError)
  .each(logSuccess)
  .done(process.exit);

/**
 * Find or create a comment based on the id
 * created in the translation.
 *
 * @param  {Object} asset
 * @return {Stream}
 */
 function saveAsset(asset) {
   return h(assetService.findOrCreateByUrl(asset.url))
     .flatMap(a => {
       a = Object.assign(a, asset);
       return h(a.save());
     })
 }

/**
 * Log a quick error message
 * @param  {String} message
 */
function logError({ message }) {
  console.log(JSON.stringify({
    status: 'error',
    message
  }));
}

/**
 * Log a quick success status
 *
 * @param  {String} id
 */
function logSuccess({ id }) {
  console.log(JSON.stringify({
    status: 'success',
    comment: id
  }));
}
