const express = require("express");
const router = express.Router();

// Schemas
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const User = require("../schemas/user");
const Like = require("../schemas/like");
const Unlike = require("../schemas/unlike");
const Subscribe = require("../schemas/subscribe");

// MiddleWares
const authMiddleware = require("../middleware/authMiddleWare");
const { upload } = require("../middleware/upload");

const jwt = require("jsonwebtoken");
const fs = require("fs");
const myKey = fs.readFileSync(__dirname + "/../middleware/key.txt").toString();

// 게시글 조회
router.get("/posts", async (req, res) => {
  try {
    const { postNum } = req.query;
    await Post.updateOne({ postNum }, { $inc: { postCnt: 1 } }); //postCnt 추가
    const comments = await Comment.find({ postNum }); //comment 데이터 구하기(배열)

    for (let user of comments) {
      let userInfo = await User.findOne({
        userId: user.userId,
      });
      userInfo.userPw = "";
      user.userInfo = userInfo;
    }

    const [post] = await Post.find({ postNum }); //post 데이터 구하기
    const userInfo = await User.findOne({ userId: post.userId }); //userInfo 데이터 구하기
    post.userInfo = userInfo;

    const Token = req.headers.authorization;

    let userId;
    if (Token) {
      const logInToken = Token.replace("Bearer", "");
      const token = jwt.verify(logInToken, myKey);
      userId = token.userId;
    }

    let likeCheck = false;
    let unlikeCheck = false;
    let subscribeCheck = false;
    if (userId) {
      const userLikedId = await Like.findOne({
        postNum: Number(postNum),
        userId: userId,
      });
      const userUnlikedId = await Unlike.findOne({
        postNum: Number(postNum),
        userId: userId,
      });
      const userSubId = await Subscribe.findOne({
        userSub: post.userId,
        userId: userId,
      });

      if (userLikedId) {
        likeCheck = true;
      }
      if (userUnlikedId) {
        unlikeCheck = true;
      }
      if (userSubId) {
        subscribeCheck = true;
      }
    }

    res.status(200).json({
      post,
      comments,
      likeCheck,
      unlikeCheck,
      subscribeCheck,
    });
  } catch (error) {
    console.log("posts.js 게시글 조회에서 에러남");
    res.status(400).send({ result: false, msg: "게시글 조회 실패ㅠㅠ" });
  }
});

// 게시글 작성
router.post(
  "/posts",
  authMiddleware,
  upload.fields([
    { name: "postVideo", maxCount: 1 },
    { name: "postThumb", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { postTitle, postDesc } = req.body;
      console.log(req.body)
      
      const postVideo = req.files.postVideo[0].location;
      const postThumb = req.files.postThumb[0].location;
      
      const postDate = new Date();

      const postAmount = await Post.find();

      if (postAmount.length) {
        const postSorted = postAmount.sort((a, b) => b.postNum - a.postNum);
        const MaxPostNum = postSorted[0]["postNum"];
        const postNum = MaxPostNum + 1;
        const createdPost = await Post.create({
          postNum,
          postTitle,
          postDesc,
          postVideo,
          postThumb,
          postDate,
          userId,
        });
      } else {
        const postNum = 1;
        const createdPost = await Post.create({
          postNum,
          postTitle,
          postDesc,
          postVideo,
          postThumb,
          postDate,
          userId,
        });
      }
      res.status(201).send({ result: true, msg: "등록 완료!!" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ result: false, msg: "등록 실패ㅠㅠ" });
      console.log("posts.js 게시글 작성에서 에러남");
    }
  }
);

//게시글 삭제
router.delete("/posts", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const { postNum } = req.query;
    const existPost = await Post.findOne({ postNum });
    if (existPost) {
      if (existPost.userId !== user.userId) {
        return res
          .status(400)
          .send({ result: false, msg: "게시글 작성자만 삭제할 수 있어요!" });
      } else {
        deleteS3(existPost);
        await Post.deleteOne({ postNum: Number(postNum) });
        await Comment.deleteMany({ postNum });
        await Like.deleteMany({ postNum });
        await Unlike.deleteMany({ postNum });
        res.send({ result: true, msg: "삭제 완료!!" });
      }
    }
  } catch (err) {
    res.status(400).json({ result: false, msg: "게시글 삭제 실패ㅠㅠ" });
    console.log(err);
    console.log("posts.js 게시글 삭제에서 에러남");
  }
});

//게시글 수정
router.put(
  "/posts",
  upload.fields([
    { name: "postVideo", maxCount: 1 },
    { name: "postThumb", maxCount: 1 },
  ]),
  authMiddleware,
  async (req, res) => {
    try {
      const { postNum } = req.query;
      const { postTitle, postDesc } = req.body;
      const postThumb = req.files.postThumb[0].location;
      const postVideo = req.files.postVideo[0].location;
      const existPost = await Post.find({ postNum: Number(postNum) });
      if (existPost) {
        await Post.updateOne(
          { postNum: Number(postNum) },
          { $set: { postTitle, postDesc, postThumb, postVideo } }
        );
        res.status(200).json({ result: true, msg: "수정 완료!!" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ result: false, msg: "게시글 수정 실패ㅠㅠ" });
      console.log("posts.js 게시글 수정에서 에러남");
    }
  }
);

//메인 조회
router.get("/main", async (req, res) => {
  try {
    let posts = await Post.find({}).sort({ postDate: -1 });

    for (let user of posts) {
      let userInfo = await User.findOne({ userId: user.userId });
      userInfo.userPw = "";
      user.userInfo = userInfo;
    }

    const Token = req.headers.authorization;
    if (Token) {
      const logInToken = Token.replace("Bearer", "");
      const token = jwt.verify(logInToken, myKey);
      const userId = token.userId;
      const userSubIds = await Subscribe.find({ userId });

      const userSub = [];
      for (let userSubId of userSubIds) {
        let subscribeOne = await Subscribe.findOne({
          userId: userSubId.userId,
        });
        if (subscribeOne === null) {
          continue;
        } else {
          subscribeOne = await User.findOne({ userId: subscribeOne.userSub });
          userSub.push(subscribeOne);
        }
      }
      res.status(200).json({ posts, userSub });
    } else {
      res.status(200).json({ posts });
    }
  } catch (error) {
    console.log(error);
    console.log("posts.js 메인 조회에서 에러남");

    res.status(400).json({ result: false });
  }
});

module.exports = router;
