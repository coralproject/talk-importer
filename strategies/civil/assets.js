const { parseXML, translateXML } = require('../../services/pipelines');

module.exports = {
  parse: parseXML('/disqus/thread'),
  translate: translateXML(({ thread }) => ({
    id: thread.id[0],
    url: thread.link[0],
    title: thread.title[0],
    description: thread.message[0],
    publication_date: new Date(thread.createdAt[0]),
  })),
};
