const h = require('highland');
console.log('loading wp users');
module.exports = {
  /**
   * Turn a WPEngine dump row with user Id != to 0 into a user for Talk
   *
   * @param  {Object} row
   * @return {Object}
   */
  translate: row => {
    var talk = {};
    // console.log(row);

    if (row.user_id && row.user_id != '0') {
      talk.id = row.user_id;
      talk.profiles = [
        {
          id: row.comment_author_email,
          provider: 'local',
        },
      ];
      talk.username = row.comment_author;
      talk.lowercaseUsername = row.comment_author.toLowerCase();
      talk.created_at = new Date().toISOString();
    }
    return h([talk]);
  },
};
