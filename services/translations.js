'use strict';

/**
 * Turn a LiveFyre user into a user for Talk
 *
 * @param  {Object} fyre
 * @return {Object}
 */
function translateUser(fyre) {
  var talk = {};

  talk.id = fyre.id;
  talk.profiles = [{
    id: fyre.email,
    provider: 'local' // TODO: 'local' is the Talk default, but should this be configurable?
  }];
  talk.username = fyre.display_name;
  talk.lowercaseUsername = fyre.display_name && fyre.display_name.toLowerCase();
  talk.created_at = fyre.created || new Date().toISOString(); // TODO: If the data doesn't have created property then the users history won't be maintained

  return talk;
}

module.exports.translateUser = translateUser;
