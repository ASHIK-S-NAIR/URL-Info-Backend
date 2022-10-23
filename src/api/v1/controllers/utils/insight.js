const axios = require("axios");
const { convert } = require("html-to-text");
const cheerio = require("cheerio");

// Function to fetch the content from the URL
exports.fetchUrlContent = (url) => {
  return axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return {
        status: "error",
        error: "Internal Server error",
      };
    });
};

// Function to clean the content
exports.clean = (string) => {
  const alphabet = string.replace(/[^A-Za-z']+/g, " ").trim();
  const lowerCase = alphabet.toLowerCase();
  return lowerCase;
};

// Function to count the word occurrence
exports.countTotal = (string) => {
  const arr = string.split(" ");

  const length = arr.filter((word) => word !== "").length;

  return length;
};

// Function to extract text from html
exports.convertHtmlToText = (html) => {
  const text = convert(html);
  return text;
};

// Function to extract web links from webpage
exports.extractWebLinks = (content, url) => {
  let $ = cheerio.load(content);

  var webLinks = [];
  let linkObjects = $("a");

  linkObjects.each((index, element) => {
    href = $(element).attr("href");
    if (href) {
      if (href.substr(0, 4) !== "http" || href.substr(0, 5) !== "/http") {
        if (url.charAt(url.length - 1) !== "/") {
          url = `${url}/`;
        }
        href = `${url}${href}`;
        webLinks.push(href);
      } else {
        if (href.substr(0, 5) === "/http") {
          href = href.slice(1, -1);
        }
        webLinks.push(href);
      }
    }
  });

  return webLinks;
};

// Function to extract media links
exports.extractMediaLinks = (content) => {
    let $ = cheerio.load(content);
    var mediaLinks = [];
    let images = $("img");
  
    images.each((index, element) => {
      mediaLinks.push($(element).attr("src"));
    });

    return mediaLinks;
}
