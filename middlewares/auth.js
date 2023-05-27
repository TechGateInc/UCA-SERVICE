require("dotenv").config();
const jwt = require("jsonwebtoken");
const { responseHandler } = require("../utils/responseHandler");
const userModel = require("../models/Student");

const requireSignin = async (req, res, next) => {
  const header = req.headers.authorization;
  const token =
    (header && header.split(" ")[1]) || (req.cookies && req.cookies.authToken);

    console.log("Header:", header);
    console.log("Token:", token);

  if (!token) {
    return responseHandler(res, "Unauthorized Token Generation", 403);
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { user_id } = decoded;

      const user = await userModel.findById(user_id);

      if (!user) return responseHandler(res, "Unauthorized Token Validation.", 404);

      req.user = user_id;

      return next();
    } catch (err) {
      console.log("Error in decoding token", err);

      if (err.name === "TokenExpiredError") {
        return responseHandler(res, "Unauthorized, Token Expired.", 401);
      } else {
        return responseHandler(res, "Unauthorized, Token Expired i think.", 403);
      }
    }
  }
};
module.exports = { requireSignin };
