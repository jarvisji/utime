/**
 * Created by Ting on 2015/7/4.
 */
module.exports = exports = function lastModifiedPlugin(schema, options) {
  schema.add({lastModified: Date});

  schema.pre('save', function (next) {
    debugger;
    this.lastModified = new Date;
    next()
  });

  if (options && options.index) {
    schema.path('lastModified').index(options.index)
  }
};
