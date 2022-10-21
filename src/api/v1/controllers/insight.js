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

  const url = req.body.url;

  // fetch the content from the URL
  const content = await fetchUrlContent(url);

  // Extract text from html
  const text = convertHtmlToText(content);

  // clean the content
  const cleanedContent = clean(text);

  // count the word occurrence
  const result = await countTotal(cleanedContent);

  let links = [];
  let $ = cheerio.load(content);
  let linkObjects = $("a");

  linkObjects.each((index, element) => {
    links.push($(element).attr("href"));
  });

  let imageArray = [];
  let Images = $("img");

  Images.each((index, element) => {
    imageArray.push($(element).attr("src"));
  });

  Insight.create({
    domainName: url,
    wordCount: result,
    webLinks: links,
    mediaLinks: imageArray,
  });

  return res.json({ result, links, imageArray });
};

// List all insights
exports.getAllInsights = async (req, res) => {
    const insights = await Insight.find({});

    return res.json(insights);
}

exports.deleteInsight = async (req, res) => {
    try {
        await Insight.deleteOne({_id: req.insight._id});
        return res.status(200).json({
            status: "ok",
            message: "Insight has been successfully deleted"
        })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            error: "Internal Server error"
        })
    }
}
