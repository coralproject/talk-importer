'use strict';

const h = require('highland'),
  { file, concurrency = 10 } = require('yargs').argv,
  { parseFileStream } = require('./services/pipelines'),
  { translateComment } = require('./services/translations'),
  { readFile } = require('./services/fs'),
  { commentService } = require('./services/talk-services');

h.of(file)
  .flatMap(readFile)
  .pipe(parseFileStream)
  .slice(0, 1)
  .map(translateComment)
  .parallel(concurrency)
  .map(saveComment)
  .parallel(concurrency)
  .errors(logError)
  .each(logSuccess)
  .done(process.exit);

/**
 * Find or create a comment based on the id
 * created in the translation.
 *
 * @param  {Object} user
 * @return {Stream}
 */
function saveComment(comment) {
  return h(commentService.findById(comment.id))
    .flatMap(a => {
      if (a) {
        Object.assign(a, comment);
        return h(a.save());
      }
      return h(commentService.publicCreate(comment));
    });
}

/**
 * Log a quick error message
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
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
