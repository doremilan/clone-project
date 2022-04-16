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
  //추가
  postTitle: {
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
    default: 0,
  },
  postUnlikeNum: {
    type: Number,
    default: 0,
  },
  postCommentNum: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,
    required: true,
  },
  userInfo: {
    type: Object,
  },
  //추가
  postVideo: {
    type: String,
    required: true,
  },
  //추가
  postCnt: {
    type: String,
    default: 0,
  },
});

module.exports = mongoose.model("Post", postSchema);
