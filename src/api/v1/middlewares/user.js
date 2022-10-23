const User = require("../models/user");

// getUserById - Checks if an user exists with the userId from request path parameter is present inside the user collection, if present then user details is stored inside req.user.
exports.getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ status: error, error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};
