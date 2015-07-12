/**
 * Created by Ting on 2015/7/11.
 */
module.exports = {
  debugMongooseError: function (err, debug, message /* optional */) {
    if (message)
      debug(message, err);
    else
      debug('Mongoose error: ', err);
  }
};
