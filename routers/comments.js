const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const authMiddleware = require("../middleware/authMiddleWare");

// 댓글 작성
router.post("/comments", authMiddleware, async (req, res) => {
  try {
    const { contents } = req.body;
    const { postNum } = req.query;

    const { userId } = res.locals.user;

    const maxCommentNumber = await Comment.findOne().sort("-commentNum");

    let commentNum = 1;
    if (maxCommentNumber) {
      commentNum = maxCommentNumber.commentNum + 1;
    }

    const commentDate = new Date();

    await Comment.create({
      postNum,
      commentNum,
      userId,
      contents,
      commentDate,
    });

    await Post.updateOne({ postNum }, { $inc: { postCommentNum: 1 } });

    res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    console.log("comments.js -> 댓글 작성에서 에러남");

    res.status(400).json({ result: false });
  }
});

// 댓글 수정
router.put("/comments", authMiddleware, async (req, res) => {
  try {
    const { commentNum } = req.query;
    const { contents } = req.body;

    await Comment.updateOne({ commentNum }, { $set: { contents } });

    res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    console.log("comments.js -> 댓글 수정에서 에러남");

    res.status(400).json({ result: false });
  }
});

// 댓글 삭제
router.delete("/comments", authMiddleware, async (req, res) => {
  try {
    const { commentNum } = req.query;

    const commentPostNum = await Comment.findOne({ commentNum });

    await Comment.deleteOne({ commentNum });
    await Post.updateOne(
      { postNum: commentPostNum.postNum },
      { $inc: { postCommentNum: -1 } }
    );

    res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    console.log("comments.js -> 댓글 삭제에서 에러남");

    res.status(400).json({ result: false });
  }
});

module.exports = router;
