var mongoose = require('mongoose');

var API = mongoose.model('API', {
  url: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  }
});

module.exports = {API};
