const { parseXML, translateXML } = require('../../services/pipelines');
const { get } = require('lodash');

const equal = (value, compare, defaultTo) =>
  value === compare ? defaultTo : value;

module.exports = {
  parse: parseXML('/disqus/post'),
  translate: translateXML(({ post }) => ({
    id: get(post, 'id[0]'),
    status:
      get(post, 'isApproved[0]', 'false') === 'true' ? 'ACCEPTED' : 'REJECTED',
    author_id: get(post, 'author[0].username[0]'),
    parent_id: equal(get(post, 'parent[0]', null), '', null),
    created_at: get(post, 'createdAt[0]'),
    updated_at: get(post, 'createdAt[0]'),
    asset_id: get(post, 'thread[0]'),
    body: get(post, 'message[0]'),
  })),
};
