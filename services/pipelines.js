const h = require('highland');
const {
  services: { Assets, Comments, Users },
  models: { Comment },
} = require('./talk/graph/connectors');

/**
 * We're dealing with Buffers which are just strings
 * of JSON.
 *
 * - Turn the Buffer to a String
 * - Split on new lines
 * - Compact removes any falsy values
 * - Parse each lines
 */
module.exports.parseJSONStream = h.pipeline(
  h.map(buf => buf.toString('utf-8')),
  h.split(),
  h.compact(),
  h.map(JSON.parse)
);

/**
 * Utilities for saving the transformed content.
 */
module.exports.save = {
  /**
   * Find or create a comment based on the id
   * created in the translation.
   *
   * @param  {Object} asset
   * @return {Stream}
   */
  assets: asset =>
    h(Assets.findOrCreateByUrl(asset.url)).flatMap(a => {
      a = Object.assign(a, asset);
      return h(a.save());
    }),

  /**
   * Find or create a comment based on the id
   * created in the translation.
   *
   * @param  {Object} user
   * @return {Stream}
   */
  comments: comment => {
    return h(Comment.findOne({ id: comment.id })).flatMap(foundComment => {
      if (foundComment) {
        Object.assign(foundComment, comment);
        return h(foundComment.save());
      }
      console.log('comment', comment);
      return h(Comments.publicCreate(comment));
    });
  },

  /**
   * Find or create a user based on the profile
   * created in the translation.
   *
   * @param  {Object} user
   * @return {Stream}
   */
  users: user => {
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
  },
};
