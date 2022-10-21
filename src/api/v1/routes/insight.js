const express = require("express");
const { getInsightUrl, getAllInsights, deleteInsight } = require("../controllers/insight");
const { getInsightById } = require("../middlewares/insight");
const router = express.Router();

// router to access param and getInsight from Database
router.param(":insightId", getInsightById);

// route to get insights
router.post("/insight/search", getInsightUrl);

// route to add insights to insights table
router.post("/insights/add", );

// route to list all insights
router.get("/insight", getAllInsights);

// route to remove an insights
router.delete("/insight/:insightId", deleteInsight);

// route to update an insights
router.put("/insight", );



module.exports = router;