const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleWare");
const Post = require("../schemas/post");
const Like = require("../schemas/like");
const Unlike = require("../schemas/unlike");

// 좋아요
router.post("/like", authMiddleware, async (req, res) => {
  try {
    const { postNum } = req.query;
    const { likeCheck, unlikeCheck } = req.body;
    console.log(likeCheck,unlikeCheck)
    const { userId } = res.locals.user;

    if (likeCheck) {
      await Post.updateOne({ postNum }, { $inc: { postLikeNum: -1 } });
      await Like.deleteOne({ postNum, userId });
    } else {
      await Post.updateOne({ postNum }, { $inc: { postLikeNum: 1 } });
      await Like.create({ postNum, userId });
      if (unlikeCheck) {
        await Post.updateOne({ postNum }, { $inc: { postUnlikeNum: -1 } });
        await Unlike.deleteOne({ postNum, userId });
      }
    }

    res.status(200).json({ result: true,postLikeNum,postUnlikeNum });
  } catch (error) {
    console.log(error);
    console.log("likes.js 좋아요에서 에러남");

    res.status(400).json({ result: false });
  }
});

// 싫어요
router.post("/unlike", authMiddleware, async (req, res) => {
  try {
    const { postNum } = req.query;
    const { likeCheck, unlikeCheck } = req.body;
    console.log(likeCheck,unlikeCheck)
    const { userId } = res.locals.user;

    if (unlikeCheck) {
      await Post.updateOne({ postNum }, { $inc: { postUnlikeNum: -1 } });
      await Unlike.deleteOne({ postNum, userId });
    } else {
      await Post.updateOne({ postNum }, { $inc: { postUnlikeNum: 1 } });
      await Unlike.create({ postNum, userId });
      if (likeCheck) {
        await Post.updateOne({ postNum }, { $inc: { postLikeNum: -1 } });
        await Like.deleteOne({ postNum, userId });
      }
    }

    res.status(200).json({ result: true },{unlikeCheck},{likeCheck});
  } catch (error) {
    console.log(error);
    console.log("likes.js 싫어요에서 에러남");

    res.status(400).json({ result: false });
  }
});

module.exports = router;
