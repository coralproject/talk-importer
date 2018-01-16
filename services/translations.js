'use strict';

const h = require('highland'),
  striptags = require('striptags');

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

/**
 * Given a document, grab the comments and then return
 * a stream of the translated comments
 *
 * @param  {String} id
 * @param  {Array} comments
 * @return {Stream}
 */
function translateComment({ id, comments }) {
  // Return a stream of the comments, we'll merge this back
  // into the main import stream
  return h(comments)
    .map(function (comment) {
      var createdDate = new Date(comment.created).toISOString(); // Store date, we'll use it twice

      return {
        status: 'ACCEPTED',
        id: comment.id,
        author_id: comment.author_id, // get rid of livefyre id suffix
        parent_id: comment.parent_id || null,
        created_at: createdDate,
        updated_at: createdDate,
        asset_id: id, // The id from the actual article
        body: striptags(comment.body_html, [])
      }
    });
}

module.exports.translateComment = translateComment;
module.exports.translateUser = translateUser;
