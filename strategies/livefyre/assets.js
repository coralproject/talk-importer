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
      id: fyre.id,
      url: fyre.source, // This url needs to be added in the permitted domains section of your Talk admin
      title: fyre.title,
      scraped: null, // Set to null because next visit to page will trigger scrape
    };
    return h([asset]);
  },
};
