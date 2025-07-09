const jwt = require("jsonwebtoken");

// Generates an admin token
module.exports.issueAdmin = function (payload) {
  console.log({ payload })
  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      exp: payload.exp,
    },
    process.env.JWT_SECRETKEY,
    { algorithm: "HS512" }
  );
};

// Verifies admin token
module.exports.verify = function (token, callback) {
  try {
    return jwt.verify(token, process.env.JWT_SECRETKEY,  { algorithm: "HS512" }, callback);
  } catch (err) {
    console.log({err})
    return false;
  }
};

// Decode token on a request and get without bearer
module.exports.decode = async (token) => {
  const parts = token.split(" ");
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
    return false;
  }
  return false;
};
