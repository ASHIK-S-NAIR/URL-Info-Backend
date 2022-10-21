const express = require("express");
const { getInsightUrl, getAllInsights } = require("../controllers/insight");
const router = express.Router();

// route to get insights
router.post("/insight/search", getInsightUrl);

// route to add insights to insights table
router.post("/insights/add", );

// route to list all insights
router.get("/insight", getAllInsights);

// route to remove an insights
router.delete("/insight", );

// route to update an insights
router.put("/insight", );



module.exports = router;