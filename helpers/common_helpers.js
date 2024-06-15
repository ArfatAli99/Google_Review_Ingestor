require("dotenv").config();
const axios = require("axios");
const ConfigurationModel = require("../models/configuration.model");
const googleServiceGCP = require("<Add your google Credentials file>");

exports.isTokenExpired = async (req, res, next) => {
  try {
    // Retrieve the stored token expiration date from MongoDB
    const tokenData = await ConfigurationModel.findOne({
      subscription_id: req.body.subscription,
    });

    if (!tokenData) {
      return res.status(400).json({ message: "Token data not found" });
    }

    const currentDateTime = new Date();
    const tokenExpireDateTime = new Date(tokenData.googleTokenExpiryDate);
    const timeDifferenceInMinutes =
      (currentDateTime - tokenExpireDateTime) / (1000 * 60);

    // Check if 10 minutes have passed
    if (timeDifferenceInMinutes >= 10 || isNaN(timeDifferenceInMinutes)) {
      // Prepare the Axios request to refresh the token
      const refreshTokenConfig = {
        method: "post",
        url: "https://oauth2.googleapis.com/token",
        data: {
          client_id: googleServiceGCP.web.client_id,
          client_secret: googleServiceGCP.web.client_secret,
          refresh_token: tokenData.googleRefreshToken,
          grant_type: "refresh_token",
        },
      };

      let axiosResponse;
      try {
        axiosResponse = await axios(refreshTokenConfig);
      } catch (error) {
        return res.status(400).json({
          message:
            "Refreshing the token has failed. The user might have changed their password or location. Reconnection is needed.",
          error: error.response.data,
        });
      }

      // Update the MongoDB record with the new token information
      await ConfigurationModel.findOneAndUpdate(
        { subscription_id: req.body.subscription },
        {
          $set: {
            googleAuthToken: axiosResponse.data.access_token,
            googleTokenExpiryDate: new Date(),
          },
        },
        { new: true }
      ).exec();
    }

    // Continue processing the request
    return next();
  } catch (error) {
    // Handle errors appropriately
    console.error("Error in isTokenExpired middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
