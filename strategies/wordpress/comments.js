const h = require('highland');
const striptags = require('striptags');

module.exports = {
  /**
   * Given a WPEnginge comment dump, grab the comments and then return
   * a stream of the translated comments
   *
   * @param  {Object} comments
   * @return {Stream}
   */

  translate: comments => {
    var createdDate = new Date(comments.comment_date).toISOString(); // Store date, we'll use it twice
    var parent = null;
    if (comments.parent_id != '0') {
      parent = comments.parent_id;
    }

    var comment = {
      status: 'ACCEPTED',
      id: comments.comment_ID,
      author_id: comments.user_id, // maps to user imported id
      parent_id: parent,
      created_at: createdDate,
      updated_at: createdDate,
      asset_id: comments.comment_post_ID, // maps to asset imported id
      body: striptags(comments.comment_content, []),
    };
    return h([comment]);
  },
};
