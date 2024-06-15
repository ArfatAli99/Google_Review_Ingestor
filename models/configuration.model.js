const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema({
  userIdentifier: {
    type: String,
    required: true,
    trim: true,
  },
  subscriptionCode: {
    type: String,
    required: true,
    trim: true,
  },
  shopCode: {
    type: String,
    required: true,
    trim: true,
  },
  serverAddress: {
    type: String,
    trim: true,
  },
  timeToLive: {
    type: String,
    trim: true,
  },
  authToken: {
    type: String,
    trim: true,
  },
  connectionCode: {
    type: String,
    trim: true,
  },
  fbPageCode: {
    type: String,
    trim: true,
  },
  fbUserCode: {
    type: String,
    trim: true,
  },
  tokenCategory: {
    type: String,
    trim: true,
  },
  fbPageTitle: {
    type: String,
    trim: true,
  },
  userTokenExpiry: {
    type: String,
    trim: true,
  },
  pageToken: {
    type: String,
    trim: true,
  },
  isFacebookActive: {
    type: Boolean,
    trim: true,
  },
  isInstagramActive: {
    type: Boolean,
    trim: true,
  },
  instaUserCode: {
    type: String,
    trim: true,
  },
  isGoogleActive: {
    type: Boolean,
    trim: true,
  },
  googleAccountCode: {
    type: String,
    trim: true,
  },
  googleLocationCode: {
    type: String,
    trim: true,
  },
  googleAuthToken: {
    type: String,
    trim: true,
  },
  googleIDToken: {
    type: String,
    trim: true,
  },
  googleTokenValidity: {
    type: String,
    trim: true,
  },
  googleTokenExpiryDate: {
    type: String,
    trim: true,
  },
  areGoogleLocationsSaved: {
    type: Boolean,
    trim: true,
  },
  googleRefreshToken: {
    type: String,
    trim: true,
  },
  agentIdentifier: {
    type: String,
    trim: true,
  },
  googleAgentName: {
    type: String,
    trim: true,
  },
  googleLocations: [],
});

module.exports = mongoose.model("Configuration", configurationSchema);
