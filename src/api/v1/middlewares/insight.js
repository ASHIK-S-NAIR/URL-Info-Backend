const Insight = require("../models/insight");

// getInsightById - Checks if an insight exists with the insightId from request path parameter is present inside the insight database, if present then insight details is stored inside req.insight.
exports.getInsightById = async(req,res, next, id) => {
    try {
        const insight = await Insight.findById({_id : id});
        req.insight = insight;
        next();
    } catch (error) {
        return res.status(400).json({
            status: "error",
            error: "Internal Server error"
        })
    }
}