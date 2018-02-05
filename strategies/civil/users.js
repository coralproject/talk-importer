const { parseXML, translateXML } = require('../../services/pipelines');
const { get } = require('lodash');

module.exports = {
  parse: parseXML('/disqus/post/author'),
  translate: translateXML(({ author }) => {
    const id = get(author, 'username[0]', null);
    const username = get(author, 'name[0]', null);

    return {
      id,
      username: id,
      lowercaseUsername: id.toLowerCase(),
      profiles: [{ provider: 'civil', id }],
      metadata: { username },
    };
  }),
};
