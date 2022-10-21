const express = require("express");
const { signup, login } = require("../controllers/auth");
const router = express.Router();

//signup
// @type POST
// @route /api/v1/signup
// @desc route to signup
// @access PUBLIC
router.post("/signup", signup);

//login
// @type POST
// @route /api/v1/login
// @desc route to login for all customers, employee and admin
// @access PUBLIC
router.post("/login", login);

module.exports = router;