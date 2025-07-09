const { config } = require("./configAll");

module.exports.getMongoConfig = () => {
  const env = config.MODE || 'development';
  return {
    MODE: env.toLowerCase(),
    MONGO_CONNECTION_STRING: config.mongoUri
  };
};