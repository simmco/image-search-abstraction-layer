var mongoose = require('mongoose');

var APICount = mongoose.model('APICount', {
  term: {
    type: String,
    required: true
  },
  when: {
    type: Date,
    required: true
  }
});

module.exports = {APICount};
