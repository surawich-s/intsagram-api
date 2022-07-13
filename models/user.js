const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String,
  profileDescription: String,
  postCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  followerCount: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
