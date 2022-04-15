const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  postNum: {
    type: Number,
    required: true,
  },
  commentNum: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  commentDate: {
    type: Date,
    required: true,
  },
  userInfo: {
    type: Object,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
