const Insight = require("../models/insight");
const validUrl = require("valid-url");

// getInsightById - Checks if an insight exists with the insightId from request path parameter is present inside the insight database, if present then insight details is stored inside req.insight.
exports.getInsightById = async (req, res, next, id) => {
  try {
    const insight = await Insight.findById({ _id: id });
    req.insight = insight;
    next();
  } catch (error) {
    return res.status(400).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};

// isValidUrl - Checks if the input url is valid or not.
exports.isValidUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ status: "error", error: "Invalid url" });
    }

    if (!validUrl.isUri(url)) {
      return res.status(400).json({ status: "error", error: "Invalid url" });
    }

    req.url = url;
    next();
  } catch (error) {
    return res.status(400).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};
