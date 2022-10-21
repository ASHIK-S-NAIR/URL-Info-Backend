const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

const { convert } = require("html-to-text");
const cheerio = require("cheerio");
require("dotenv").config();

const dbConfig = require("./setup/dbConfig");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

// Database Connection
dbConfig();

const insightRoute = require("./src/api/v1/routes/insight");

// Routes
app.use("/api/v1/", insightRoute);

app.get("/", (req, res) => {
  res.send("Projet initialized");
});

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

const clean = (string) => {
  const alphabet = string.replace(/[^A-Za-z']+/g, " ").trim();
  const lowerCase = alphabet.toLowerCase();
  return lowerCase;
};

const countTotal = (string) => {
  const arr = string.split(" ");

  const length = arr.filter((word) => word !== "").length;

  return length;
};


app.post("/test2", async (req, res) => {
  const convertHtmlToText = (html) => {
    const text = convert(html);
    return text;
  };
  // fetch the content from the URL
  // clean the content
  // count the word occurrence and send it back

  const url = req.body.url;
  const content = await fetchUrlContent(url);
  const text = convertHtmlToText(content);
  const cleanedContent = clean(text);
  const result = await countTotal(cleanedContent);

  let links = [];
  let $ = cheerio.load(content);
  let linkObjects = $("a");

  linkObjects.each((index, element) => {
    links.push({
      text: $(element).text(),
      href: $(element).attr("href"),
    });
  });

  let imageArray = [];
  let Images = $("img");

  Images.each((index, element) => {
    imageArray.push($(element).attr("src"));
  });

  res.json({ result, links, imageArray });
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
