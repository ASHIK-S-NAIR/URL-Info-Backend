const { Schema, model, default: mongoose } = require("mongoose");

const insightSchema = new Schema({
  domainName: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  webLinks: [String],
  mediaLinks: [String],
  favourite: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Insight", insightSchema);
