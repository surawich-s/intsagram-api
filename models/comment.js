const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commentDetail: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
