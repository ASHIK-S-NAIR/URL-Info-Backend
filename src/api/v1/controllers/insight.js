const Insight = require("../models/insight");
const axios = require("axios");
const { convert } = require("html-to-text");
const cheerio = require("cheerio");

exports.getInsightUrl = async (req, res) => {
  // Function to fetch the content from the URL
  const fetchUrlContent = (url) => {
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to clean the content
  const clean = (string) => {
    const alphabet = string.replace(/[^A-Za-z']+/g, " ").trim();
    const lowerCase = alphabet.toLowerCase();
    return lowerCase;
  };

  // Function to count the word occurrence
  const countTotal = (string) => {
    const arr = string.split(" ");

    const length = arr.filter((word) => word !== "").length;

    return length;
  };

  // Function to extract text from html
  const convertHtmlToText = (html) => {
    const text = convert(html);
    return text;
  };

  const { url } = req.body;

  // fetch the content from the URL
  const content = await fetchUrlContent(url);

  // Extract text from html
  const text = convertHtmlToText(content);

  // clean the content
  const cleanedContent = clean(text);

  // count the word occurrence
  var wordCount = await countTotal(cleanedContent);

  let $ = cheerio.load(content);

  var webLinks = [];
  let linkObjects = $("a");

  linkObjects.each((index, element) => {
    href = $(element).attr("href");
    if (href.substr(0, 4) !== "http") {
      href = `${url}/${href}`;
    }
    webLinks.push(href);
  });

  var mediaLinks = [];
  let Images = $("img");

  Images.each((index, element) => {
    mediaLinks.push($(element).attr("src"));
  });

  const insight = await Insight.create({
    domainName: url,
    wordCount: wordCount,
    webLinks: webLinks,
    mediaLinks: mediaLinks,
  });

  const { favourite} = insight;

  return res.json({domainName: url, wordCount, favourite, webLinks, mediaLinks});
};

// List all insights
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
    console.log("error", error.message);
    return res.status(500).json({
      status: "error",
      error: "Internal Server error",
    });
  }
};
