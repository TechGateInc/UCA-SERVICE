const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.generateAccessToken = (user_id) => {
  return jwt.sign({ user_id }, JWT_SECRET, { expiresIn: "2h" });
};

// module.exports={generateAccessToken}
