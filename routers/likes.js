const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleWare");
const Post = require("../schemas/post");
const Like = require("../schemas/like");
const User = require("../schemas/user");
const Unlike = require("../schemas/unlike");
const Subscribe = require("../schemas/subscribe");

// 좋아요
router.post("/like", authMiddleware, async (req, res) => {
  try {
    const { postNum, likeCheck } = req.body;
    const { userId } = res.locals.user;

    if (likeCheck) {
      await Post.updateOne({ postNum }, { $inc: { postLikeNum: -1 } });
      await Like.deleteOne({ postNum, userId });
    } else {
      await Post.updateOne({ postNum }, { $inc: { postLikeNum: 1 } });
      await Like.create({ postNum, userId });
    }

    res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    console.log("likes.js -> 좋아요에서 에러남");

    res.status(400).json({ result: false });
  }
});

// 싫어요
router.post("/unlike", authMiddleware, async (req, res) => {
  try {
    const { postNum, likeCheck } = req.body;
    const { userId } = res.locals.user;

    if (likeCheck) {
      await Post.updateOne({ postNum }, { $inc: { postUnlikeNum: -1 } });
      await Unlike.deleteOne({ postNum, userId });
    } else {
      await Post.updateOne({ postNum }, { $inc: { postUnlikeNum: 1 } });
      await Unlike.create({ postNum, userId });
    }

    res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    console.log("likes.js -> 싫어요에서 에러남");

    res.status(400).json({ result: false });
  }
});

// 구독
router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { userSub, subCheck } = req.body;
    const { userId } = res.locals.user;

    if (subCheck) {
      await User.updateOne(
        { userId: userSub },
        { $inc: { userSubscribe: -1 } }
      );
      await Subscribe.deleteOne({ userId: userSub, userId });
    } else {
      await User.updateOne({ userId: userSub }, { $inc: { userSubscribe: 1 } });
      await Subscribe.create({ userId: userSub, userId });
    }

    res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    console.log("likes.js -> 싫어요에서 에러남");

    res.status(400).json({ result: false });
  }
});

module.exports = router;
