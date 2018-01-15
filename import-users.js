'use strict';

const h = require('highland'),
  { file, concurrency = 10 } = require('yargs').argv,
  { parseFileStream } = require('./services/pipelines'),
  { translateUser } = require('./services/translations'),
  { readFile } = require('./services/fs'),
  { userService, userModel } = require('./services/talk-services');

h.of(file)
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

  return h(userService.findOrCreateExternalUser({
    id: profile.id,
    displayName: user.username,
    provider: profile.provider
  }))
    .flatMap(a => {
      a = Object.assign(a, user);
      return h(a.save());
    })
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
    user_id: id
  }));
}
