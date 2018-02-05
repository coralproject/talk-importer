const h = require('highland');
const {
  services: { Assets, Comments, Users },
  models: { Comment },
} = require('./talk/graph/connectors');
const { get } = require('lodash');
const { PassThrough } = require('stream');
var saxpath = require('saxpath');
var sax = require('sax');
const { parseString } = require('xml2js');

/**
 * We're dealing with Buffers which are just strings
 * of JSON.
 *
 * - Turn the Buffer to a String
 * - Split on new lines
 * - Compact removes any falsy values
 * - Parse each lines
 */
module.exports.parseJSONStream = h.pipeline(
  h.map(buf => buf.toString('utf-8')),
  h.split(),
  h.compact(),
  h.map(JSON.parse)
);

const parseXMLPhase = xml => {
  // create a new Stream
  return h((push, next) => {
    // do something async when we read from the Stream
    parseString(xml, (err, data) => {
      push(err, data);
      push(null, h.nil);
    });
  });
};

const parseXMLStream = selector => xml =>
  h((push, next) => {
    const parser = sax.createStream(true);
    const streamer = new saxpath.SaXPath(parser, selector);

    xml.pipe(parser);

    streamer.on('match', match => {
      push(null, match);
    });

    streamer.on('end', () => {
      push(null, h.nil);
    });
  });

module.exports.parseXML = selector =>
  h.pipeline(
    h.map(buf => {
      const stream = new PassThrough();
      stream.end(buf);
      return stream;
    }),
    h.map(parseXMLStream(selector))
  );

module.exports.translateXML = translation => stream =>
  h(stream)
    .map(parseXMLPhase)
    .parallel(10)
    .map(translation)
    .uniqBy(({ id: a }, { id: b }) => a === b);

/**
 * Utilities for saving the transformed content.
 */
module.exports.save = {
  /**
   * Find or create a comment based on the id
   * created in the translation.
   *
   * @param  {Object} asset
   * @return {Stream}
   */
  assets: asset =>
    h(Assets.findOrCreateByUrl(asset.url)).flatMap(a => {
      a = Object.assign(a, asset);
      return h(a.save());
    }),

  /**
   * Find or create a comment based on the id
   * created in the translation.
   *
   * @param  {Object} user
   * @return {Stream}
   */
  comments: comment => {
    return h(Comment.findOne({ id: comment.id })).flatMap(foundComment => {
      if (foundComment) {
        Object.assign(foundComment, comment);
        return h(
          foundComment.save().catch(err => {
            err.id = comment.id;
            throw err;
          })
        );
      }
      return h(
        Comments.publicCreate(comment).catch(err => {
          err.id = comment.id;
          throw err;
        })
      );
    });
  },

  /**
   * Find or create a user based on the profile
   * created in the translation.
   *
   * @param  {Object} user
   * @return {Stream}
   */
  users: user => {
    const profile = get(user, 'profiles[0]', null);

    return h(
      Users.findOrCreateExternalUser({
        id: profile.id,
        displayName: user.username,
        provider: profile.provider,
      }).catch(err => {
        err.id = user.id;
        throw err;
      })
    ).flatMap(a => {
      a = Object.assign(a, user);
      return h(
        a.save().catch(err => {
          err.id = user.id;
          throw err;
        })
      );
    });
  },
};
