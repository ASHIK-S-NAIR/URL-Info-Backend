const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password: plainTextPassword } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid name" });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid email" });
  }
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid password" });
  }
  if (plainTextPassword.length < 5) {
    return res.status(400).json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  const password = await bcryptjs.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      name,
      email,
      password,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    if (error.code === 11000) {
      return res
        .status(500)
        .json({ status: "error", error: "Username already in use" });
    }
    return res.status(500).json({ status: "Internal Server Error" });
  }

  return res
    .status(200)
    .json({ status: "ok", message: "user created successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid username" });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid password" });
  }

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res
      .status(400)
      .json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcryptjs.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ status: "ok", token });
  }
  res.status(400).json({ status: "error", data: "Invalid username/password" });
};


