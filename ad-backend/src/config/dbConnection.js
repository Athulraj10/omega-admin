const mongoose = require("mongoose");
const logger = require("../logger/logger");
const { getMongoConfig } = require('./mongodbConfig');
const fs = require("fs");
const path = require("path");
const connect = () => {
  const { MONGO_CONNECTION_STRING } = getMongoConfig()
  const /* The `url` variable in the provided code is storing the MongoDB connection string retrieved
  from the `getMongoConfig()` function. This connection string is used to establish a
  connection to the MongoDB database using Mongoose. */
    url = MONGO_CONNECTION_STRING;
  logger.info("process.env.MONGO_CONNECTION_STRING :::" + MONGO_CONNECTION_STRING);

  const pemFilePath = process.env.PEM_FILE_PATH;

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // tls: true,
    // sslValidate: false,
    // sslCA: pemFilePath.toString(), // Provide the CA certificate file for SSL connections
    // Please Uncomment when pushing the code to github
  };

  mongoose.connect(url, mongooseOptions);

  mongoose.connection.once("open", async () => {
    logger.info("Connected to database");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("Error connecting to database  ", err);
  });
};

const disconnect = () => {
  if (!mongoose.connection) {
    return;
  }

  mongoose.disconnect();

  mongoose.once("close", async () => {
    console.log("Diconnected  to database");
  });
};

module.exports = {
  connect,
  disconnect,
};
