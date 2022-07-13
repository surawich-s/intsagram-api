const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  followee: String,
  follower: String,
});
const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
