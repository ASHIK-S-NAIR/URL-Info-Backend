const Insight = require("../models/insight");
const {
  fetchUrlContent,
  convertHtmlToText,
  clean,
  countTotal,
  extractWebLinks,
  extractMediaLinks,
} = require("./utils/insight");

// getInsightUrl - Function to get insight of the an url like, wordCount, web links and media links.
exports.getInsightUrl = async (req, res) => {
  
  // fetch the content from the URL
  const content = await fetchUrlContent(req.url);

  if (content.status === "error") {
    res.status(500).json({
      status: "error",
      error: "Internal Server error",
    });
  }

  // Extract text from html
  const text = convertHtmlToText(content);

  // clean the content
  const cleanedContent = clean(text);

  // count the word occurrence
  var wordCount = countTotal(cleanedContent);

  // extract webLinks from web page
  const webLinks = extractWebLinks(content, req.url);

  // extract mediaLinks from web page
  const mediaLinks = extractMediaLinks(content);

  const insight = await Insight.create({
    domainName: req.url,
    wordCount: wordCount,
    webLinks: webLinks,
    mediaLinks: mediaLinks,
  });

  const { favourite } = insight;

  return res.json({
    domainName: req.url,
    wordCount,
    favourite,
    webLinks,
    mediaLinks,
  });
};

// getAllInsights - Function to get/list all the insights from the insight collection.
exports.getAllInsights = async (req, res) => {
  try {
    const insights = await Insight.find({});

    return res.json(insights);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};

// deleteInsight - Function to delete an insight from insight collection. InsightId obtained as path paramter and insight details stored inside req.insight by middleware.
exports.deleteInsight = async (req, res) => {
  try {
    await Insight.deleteOne({ _id: req.insight._id });
    return res.status(200).json({
      status: "ok",
      message: "Insight has been successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};

// deleteAllInsights - Function to delete all insights from insight collection.
exports.deleteAllInsights = async (req, res) => {
  try {
    await Insight.deleteMany();
    return res.status(200).json({
      status: "ok",
      message: "All Insights has been successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};

// deleteInsight - Function to update an insight from insight collection. InsightId obtained as path paramter and insight details stored inside req.insight by middleware. content to be updated will be obtained from req.body.
exports.updateInsight = async (req, res) => {
  try {
    await Insight.findByIdAndUpdate(
      { _id: req.insight._id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );

    return res.status(200).json({
      status: "ok",
      message: "Insight has been successfully updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};
