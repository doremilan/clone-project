const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  postNum: {
    type: Number,
    required: true,
  },
  postDesc: {
    type: String,
    required: true,
  },
  postThumb: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    required: true,
  },
  postLikeNum: {
    type: Number,
    required: true,
  },
  postCommentNum: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userInfo: {
    type: Object,
  },
});

module.exports = mongoose.model("Post", postSchema);
