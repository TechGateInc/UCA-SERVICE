function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json("You are not authenticated!");
}

module.exports = isAuthenticated;
