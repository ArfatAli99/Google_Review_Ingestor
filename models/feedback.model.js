const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    subscriptionId: {
      type: String,
      required: true,
      trim: true,
    },
    shopId: {
      type: String,
      required: true,
      trim: true,
    },
    fbReviews: {
      type: String,
      required: true,
      trim: true,
    },
    gReviews: {
      type: Object,
      required: true,
      trim: true,
    },
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
