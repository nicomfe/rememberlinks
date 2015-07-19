'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LinkSchema = new Schema({
  url: String,
  info: String,
  tags: [String],
  userId: String,
  date: Date
});

module.exports = mongoose.model('Link', LinkSchema);