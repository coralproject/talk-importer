const h = require('highland');
const { file, concurrency = 10 } = require('yargs').argv;
const { parseFileStream } = require('./services/pipelines');
const { translateComment } = require('./services/translations');
const { readFile } = require('./services/fs');
const { services: { Comments } } = require('./services/talk/graph/connectors');

h
  .of(file)
  .flatMap(readFile)
  .pipe(parseFileStream)
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
  return h(Comments.findById(comment.id)).flatMap(a => {
    if (a) {
      Object.assign(a, comment);
      return h(a.save());
    }
    return h(Comments.publicCreate(comment));
  });
}

/**
 * Log a quick error message
 * @param  {String} message
 */
function logError({ message }) {
  console.log(
    JSON.stringify({
      status: 'error',
      message,
    })
  );
}

/**
 * Log a quick success status
 *
 * @param  {String} id
 */
function logSuccess({ id }) {
  console.log(
    JSON.stringify({
      status: 'success',
      comment: id,
    })
  );
}
