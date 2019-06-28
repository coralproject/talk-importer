const h = require('highland');
module.exports = {
  /**
   * Turn the collection into a Talk asset
   *
   * @param {Object} row
   * @return {Object}
   */
  translate: row => {
    var asset = {
      id: row.comment_post_ID,
      url: `http://yourdomainhere.com/?p=${row.comment_post_ID}`, // This url needs to be added in the permitted domains section of your Talk admin
      title: row.comment_post_ID,
      scraped: null, // Set to null because next visit to page will trigger scrape
    };
    return h([asset]);
  },
};
