require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
require("./config/db");

const FeedbackModel = require("./models/feedback.model");
const ConfigurationModel = require("./models/configuration.model");
const { isTokenExpired } = require("./helpers/common_helpers");
const { responseHeader } = require("./middlewares/index");

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(responseHeader);

// Endpoint to fetch reviews and save to MongoDB
app.post("/api/reviews", isTokenExpired, async (req, res) => {
  try {
    const { subscription_id } = req.body;

    // Validate subscription ID presence
    if (!subscription_id) {
      return res.status(400).json({ error: "Subscription ID is required" });
    }

    // Find subscription info in the database
    const subscriptionInfo = await ConfigurationModel.findOne({
      subscription_id,
    });

    if (!subscriptionInfo) {
      return res
        .status(400)
        .json({ error: "Subscription does not exist in database" });
    }

    // Check if Google integration is active
    if (!subscriptionInfo.isGoogleActive) {
      return res
        .status(400)
        .json({ error: "This Subscription has some missing values" });
    }

    // Extract Google location ID
    const GLockCode = subscriptionInfo.google_locations[0];
    if (!GLockCode) {
      return res
        .status(400)
        .json({ error: "Location does not exist in this Subscription" });
    }

    // Configure Google API request
    const config = {
      method: "get",
      url: `https://mybusiness.googleapis.com/v4/accounts/${subscriptionInfo.googleAccountCode}/locations/${GLockCode}/reviews`,
      headers: {
        Authorization: `Bearer ${subscriptionInfo.googleAuthToken}`,
      },
    };

    // Fetch reviews from Google API
    const response = await axios(config);
    let reviewResponse = response.data;
    let completeReviewObj = { ...reviewResponse };

    // Handle pagination if more reviews are available
    while (reviewResponse.reviews?.length > 0 && reviewResponse.nextPageToken) {
      const nextPageConfig = {
        ...config,
        url: `${config.url}?pageToken=${reviewResponse.nextPageToken}`,
      };
      const nextPageResponse = await axios(nextPageConfig);
      completeReviewObj.reviews.push(...nextPageResponse.data.reviews);
      reviewResponse = nextPageResponse.data;
    }

    // If no reviews found, return success message
    if (completeReviewObj.reviews.length === 0) {
      return res.status(200).json({
        message:
          "Reviews have been successfully saved in the Database, but this Subscription doesn't have any reviews",
      });
    }

    // Prepare data to update in MongoDB
    const itemToUpdate = {
      sub_id: subscriptionInfo.sub_id,
      subscription_id: subscriptionInfo.subscription_id,
      gReviews: completeReviewObj,
    };

    // Update or insert into FeedbackModel collection in MongoDB
    await FeedbackModel.findOneAndUpdate(
      { subscription_id: subscriptionInfo.subscription_id },
      { $set: itemToUpdate },
      { upsert: true }
    );

    // Return success message
    return res.status(200).json({
      message: "Reviews have been successfully saved in the Database",
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching reviews:", error);
    return res.status(400).json({ error: "Reviews fetching failed" });
  }
});

// Export serverless handler
module.exports.handler = serverless(app);
