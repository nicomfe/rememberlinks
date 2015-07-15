'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LinkSchema = new Schema({
  url: String,
  info: String,
  userId: String
});

module.exports = mongoose.model('Link', LinkSchema);