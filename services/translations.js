const h = require('highland');
const striptags = require('striptags');

/**
 * Turn a LiveFyre user into a user for Talk
 *
 * @param  {Object} fyre
 * @return {Object}
 */
function translateUser(fyre) {
  var talk = {};

  talk.id = fyre.id;
  talk.profiles = [
    {
      id: fyre.email,
      provider: 'local', // TODO: 'local' is the Talk default, but should this be configurable?
    },
  ];
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
  return h(comments).map(function(comment) {
    var createdDate = new Date(comment.created).toISOString(); // Store date, we'll use it twice

    return {
      status: 'ACCEPTED',
      id: comment.id,
      author_id: comment.author_id, // get rid of livefyre id suffix
      parent_id: comment.parent_id || null,
      created_at: createdDate,
      updated_at: createdDate,
      asset_id: id, // The id from the actual article
      body: striptags(comment.body_html, []),
    };
  });
}

/**
 * Turn the collection into a Talk asset
 *
 * @param {Object} fyre
 * @return {Object}
 */
function translateAsset(fyre) {
  return {
    id: fyre.id,
    url: fyre.source, // This url needs to be added in the permitted domains section of your Talk admin
    title: fyre.title,
    scraped: null, // Set to null because next visit to page will trigger scrape
  };
}

module.exports.translateAsset = translateAsset;
module.exports.translateComment = translateComment;
module.exports.translateUser = translateUser;
