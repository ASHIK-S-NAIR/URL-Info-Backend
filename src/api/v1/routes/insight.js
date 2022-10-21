const express = require("express");
const { isSignedIn, isAuthenticated } = require("../middlewares/auth");
const {
  getInsightUrl,
  getAllInsights,
  deleteInsight,
  updateInsight,
  deleteAllInsights,
} = require("../controllers/insight");
const { getInsightById } = require("../middlewares/insight");
const { getUserById } = require("../middlewares/user");
const router = express.Router();

// param
router.param("insightId", getInsightById);
router.param("userId", getUserById);

//getInsight
// @type POST
// @route /api/v1/insight/:userId
// @desc route to get insights of the url passed via body
// @access PRIVATE
router.post(
  "/insight/:userId",
  isSignedIn,
  isAuthenticated,
  getInsightUrl
);

// getAllInsights
// @type GET
// @route /api/v1/insight/:userId
// @desc route to get all insights from the insight database
// @access PRIVATE
router.get("/insight/:userId", isSignedIn, isAuthenticated, getAllInsights);

// delete an insight
// @type DELETE
// @route /api/v1/insight/:insightId/:userId
// @desc route to delete an insight from database
// @access PRIVATE
router.delete("/insight/:insightId/:userId", isSignedIn, isAuthenticated, deleteInsight);

// delete all insights
// @type DELETE
// @route /api/v1/insight/:userId
// @desc route to delete all insight from database
// @access PRIVATE
router.delete("/insight/:userId", isSignedIn, isAuthenticated, deleteAllInsights);

// update an insight
// @type PUT
// @route /api/v1/insight/:insightId/:userId
// @desc route to update an insight from database
// @access PRIVATE
router.put("/insight/:insightId/:userId", isSignedIn, isAuthenticated, updateInsight);

module.exports = router;
