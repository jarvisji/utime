var mongoose = require('mongoose');
var schemas = require('./schemas')();

module.exports = {
  User: mongoose.model('User', schemas.userSchema)
};
