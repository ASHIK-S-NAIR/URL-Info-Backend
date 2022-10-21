const User = require("../models/user");

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
