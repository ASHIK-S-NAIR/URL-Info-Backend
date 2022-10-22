const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup - Function to validate inputs and store them as a new user inside user database.
exports.signup = async (req, res) => {
  const { name, email, password: plainTextPassword } = req.body;

  // validating name
  if (!name || typeof name !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid name" });
  }
  // validating email
  if (!email || typeof email !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid email" });
  }
  // validating password
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid password" });
  }
  if (plainTextPassword.length < 5) {
    return res.status(400).json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  // encrypting passwords as hashed passwords instead of plaintext
  const password = await bcryptjs.hash(plainTextPassword, 10);

  try {
    // storing new user details inside user database.
    await User.create({
      name,
      email,
      password,
    });
  } catch (error) {
    // error code 11000 means a duplicate entry.
    if (error.code === 11000) {
      return res
        .status(500)
        .json({ status: "error", error: "email already in use" });
    }
    return res.status(500).json({ status: "Internal Server Error" });
  }

  // response with status and success message is sent back
  return res
    .status(200)
    .json({ status: "ok", message: "user created successfully" });
};

// Function to validate inputs and return details of user if present from user database with newly generated token.
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // validating email
  if (!email || typeof email !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid username" });
  }
  // validating password
  if (!password || typeof password !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid password" });
  }

  // get user details from user database
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ status: "error", error: "Invalid username/password" });
  }

  // comparing the password from user with the encrypted password from user database using bcryptjs.
  if (await bcryptjs.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    const { _id, name, email } = user;

    // response with status, user details and generated token is sent back
    return res
      .status(200)
      .json({ status: "ok", user: { _id, name, email }, token });
  }
  res.status(400).json({ status: "error", data: "Invalid username/password" });
};
