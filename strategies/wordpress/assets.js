const h = require('highland');
module.exports = {
  /**
   * Turn the collection into a Talk asset
   *
   * @param {Object} fyre
   * @return {Object}
   */
  translate: fyre => {
    var asset = {
      id: fyre.comment_post_ID,
      url: `https://rivardreport.com/asset/${fyre.comment_post_ID}`, // This url needs to be added in the permitted domains section of your Talk admin
      title: fyre.comment_post_ID,
      scraped: null, // Set to null because next visit to page will trigger scrape
    };
    return h([asset]);
  },
};
