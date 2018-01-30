const h = require('highland');
const striptags = require('striptags');

module.exports = {
  /**
   * Given a document, grab the comments and then return
   * a stream of the translated comments
   *
   * @param  {String} id
   * @param  {Array} comments
   * @return {Stream}
   */
  translate: ({ id, comments }) => {
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
  },
};
