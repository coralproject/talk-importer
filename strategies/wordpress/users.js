const h = require('highland');
console.log('loading wp users');
module.exports = {
  /**
   * Turn a LiveFyre user into a user for Talk
   *
   * @param  {Object} fyre
   * @return {Object}
   */
  translate: fyre => {
    var talk = {};
    // console.log(fyre);

    if (fyre.user_id && fyre.user_id != '0') {
      talk.id = fyre.user_id;
      talk.profiles = [
        {
          id: fyre.comment_author_email,
          provider: 'local', // TODO: 'local' is the Talk default, but should this be configurable?
        },
      ];
      talk.username = fyre.comment_author;
      talk.lowercaseUsername = fyre.comment_author.toLowerCase();
      talk.created_at = new Date().toISOString();
    }
    return h([talk]);
  },
};
