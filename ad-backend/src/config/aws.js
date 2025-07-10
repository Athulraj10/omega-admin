// s3Client.js
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AMZ_REGION,
  credentials: {
    accessKeyId: process.env.AMZ_ACCESS_KEY,
    secretAccessKey: process.env.AMZ_SECRET_ACCESS_KEY,
  },
  systemClockOffset: 30000, // (optional) adjust time skew manually if needed
});

module.exports = { s3 };
