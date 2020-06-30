const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;

const createToken = (payload) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiration,
  });

  return token;
};

const decodeToken = (token) => {
  try {
    const payload = jwt.verify(token, jwtSecret);
    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = { createToken, decodeToken };
