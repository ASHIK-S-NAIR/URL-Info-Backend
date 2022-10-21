const jwt = require("jsonwebtoken");

exports.isSignedIn = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedToken) {
        res.status(403).json({ status: "error", error: "Unauthorized Access" });
      }

      req.profile = await decodedToken;
      next();
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: "Authorization failed",
      });
    }
  }
};

// isAuthenticated
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.user && req.profile.id == req.user._id;
  if (!checker) {
    return res.status(403).json({
      status: "error",
      message: "Authentication failed",
    });
  }
  next();
};
