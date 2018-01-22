const h = require('highland');
const { file, concurrency = 10 } = require('yargs').argv;
const { parseFileStream } = require('./services/pipelines');
const { translateUser } = require('./services/translations');
const { readFile } = require('./services/fs');
const { services: { Users } } = require('./services/talk/graph/connectors');

h
  .of(file)
  .flatMap(readFile)
  .pipe(parseFileStream)
  .map(translateUser)
  .map(saveUser)
  .parallel(concurrency)
  .errors(logError)
  .each(logSuccess)
  .done(process.exit);

/**
 * Find or create a user based on the profile
 * created in the translation.
 *
 * @param  {Object} user
 * @return {Stream}
 */
function saveUser(user) {
  var profile = user.profiles[0];

  return h(
    Users.findOrCreateExternalUser({
      id: profile.id,
      displayName: user.username,
      provider: profile.provider,
    })
  ).flatMap(a => {
    a = Object.assign(a, user);
    return h(a.save());
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
      user_id: id,
    })
  );
}
