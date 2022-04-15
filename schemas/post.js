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
  //default값 추가
  postLikeNum: {
    type: Number,
    required: true,
    default: 0,
  },
  //default값 추가
  postUnlikeNum: {
    type: Number,
    required: true,
    default: 0,
  },
  //default값 추가
  postCommentNum: {
    type: Number,
    required: true,
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
  //추가 (default값 지정)
  postCnt: {
    type: String,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Post", postSchema);
