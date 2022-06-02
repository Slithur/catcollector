// we are adding mongoose to this file
const mongoose = require("mongoose");

// we are creating a new book schema object.
const animeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  img: String,
  founded: Number,
});

const Anime = mongoose.model("Anime", animeSchema);

module.exports = Anime;