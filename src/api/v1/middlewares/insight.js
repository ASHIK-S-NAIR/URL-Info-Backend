const Insight = require("../models/insight");

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