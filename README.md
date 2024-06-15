# Serverless API for Fetching Review Data from Google and Ingesting into MongoDB

This project is a serverless API designed to fetch review data from Google and ingest it into MongoDB.

## Features

- Serverless architecture using AWS Lambda and API Gateway
- Fetches review data from Google API
- Stores data in MongoDB
- CI/CD pipeline deploys code to AWS based on branch configuration
- Supports local testing with Serverless Offline plugin

## Configuration

### Google API Credentials

To fetch review data from Google, you need to set up Google API credentials and configure them securely in the Serverless environment variables. Follow these steps:

1. Set up Google API credentials with appropriate permissions to access review data.
2. Securely configure these credentials in the Serverless environment variables. Example:
   ```sh
   serverless config credentials --provider google --key <path_to_google_keyfile.json>
   ```

## Deployment

### Branch Configuration

The deployment pipeline is configured to deploy based on the following branch mappings:

- **Development branch (`dev`)**: Code pushed to this branch triggers deployment to the `beta` environment.
- **Staging branch (`staging`)**: Code pushed to this branch triggers deployment to the `staging` environment.
- **Main branch (`main`)**: Code pushed to this branch triggers deployment to the `prod` (production) environment.

Deployment to AWS regions is handled according to the pipeline settings configured for each environment.

### AWS Region

The pipeline deploys the code to the AWS region configured in the pipeline settings.

## Local Testing

To test the API locally, follow these steps:

1. **Install Dependencies**: Ensure you have Node.js and npm installed.
2. **Clone the Repository**: Clone this repository to your local machine.
3. **Install Serverless Framework**: Install the Serverless Framework globally if not already installed:

   ```sh
   npm install -g serverless
   ```

4. **Set Up Environment Variables:** Create a .env file in the project root and add your Google API credentials:

   ```makefile
   GOOGLE_API_KEY_SECRET=<GOOGLE_API_KEY_SECRET>
   GOOGLE_PRIVATE_KEY=<your_google_private_key>
   ```

5. **Start Serverless Offline:** Start the Serverless Offline plugin for local testing:

   ```sh
   serverless offline start
   ```

6. **Test the API:** Use tools like Postman or cURL to test the API endpoints locally. Example endpoint:

   ```code
   POST http://localhost:3000/api/reviews
   ```
