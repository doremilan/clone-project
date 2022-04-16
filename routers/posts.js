const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const Comment = require("../schemas/Comment");
const User = require("../schemas/user");
const Like = require("../schemas/like");
const Unlike = require("../schemas/unlike");
const Subscribe = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");
const { upload } = require("../middlewares/upload");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const myKey = fs.readFileSync(__dirname + "/../middleware/key.txt").toString();

// 게시글 조회
router.get("/posts/:postNum", async (req, res) => {
  try {
    const { postNum } = req.params;
    await Post.updateOne({ postNum }, { $inc: { postCnt: 1 } }); //postCnt 추가
    const [comments] = await Comment.find({ postNum }); //comment 데이터 구하기(배열)

    const likes = await Like.find({ postNum });
    const totalLike = likes.length; //totalLike 데이터 구하기

    const post = await Post.find({ postNum }); //post 데이터 구하기
    const userInfo = await User.findOne({ userId: post.userId }); //userInfo 데이터 구하기

    const Token = req.headers.authorization;
    const logInToken = Token.replace("Bearer", "");

    const token = jwt.verify(logInToken, myKey);
    const userId = token.userId;

    const userLikedId = await Like.findOne({
      postNum: postNum,
      userId: userId,
    });
    const userUnlikedId = await Unlike.findOne({
      postNum: postNum,
      userId: userId,
    });
    const userSubId = await Subscribe.findOne({ userId: userId });

    if (userLikedId) {
      const likeCheck = true;
    } else {
      const likeCheck = false;
    }

    if (userUnlikedId) {
      const unlikeCheck = true;
    } else {
      const unlikeCheck = false;
    }

    if (userSubId) {
      const subscribeCheck = true;
    } else {
      const subscribeCheck = false;
    }
    res.status(200).json({
      post,
      userInfo,
      comments,
      totalLike,
      likeCheck,
      unlikeCheck,
      subscribeCheck,
    });
  } catch (error) {
    res.status(404).send({ result: "false", msg: "게시글 조회 실패ㅠㅠ" });
  }
});

// res.status(200).json({ posts, userSub });
//     } catch (error) {
//       res.status(200).json({ posts });
//     }
//   } catch (error) {
//     console.log(error);
//     console.log("/api/main에서 에러남");

//     res.status(404).json({ result: false });
//   }
// });

// 게시글 작성
router.post(
  "/posts",
  authMiddleware,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { postTitle, postDesc } = req.body;
      const postVideo = req.files.videoFile.location;
      const postThumb = req.files.imageFile.location;
      const postDate = new Date(+new Date() + 3240 * 10000) //형식 확인 필요
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");

      const postAmount = await Post.find();

      if (postAmount.length) {
        const postSorted = postAmount.sort((a, b) => b.postNum - a.postNum);
        const MaxPostNum = postSorted[0]["postId"];
        const postNum = MaxPostNum + 1;
        // const postCommentNum = 0; //required 지우고 default 값 지정해놓으면 안써도 될까..? (확인필요)
        // const postCnt = 0;
        // const postLikeNum = 0;
        // const postUnlikeNum = 0;

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
        // const postCommentNum = 0; //required 지우고 default 값 지정해놓으면 안써도 될까..? (확인필요)
        // const postCnt = 0;
        // const postLikeNum = 0;
        // const postUnlikeNum = 0;
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
      res.status(201).send({ result: "true", msg: "등록 완료!!" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ result: "false", msg: "등록 실패ㅠㅠ" });
    }
  }
);

//게시글 삭제
router.delete("/posts/:postNum", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const { postNum } = req.params;
    const existPost = await Post.findOne({ postNum: postNum });
    if (existPost) {
      if (existPost.userId !== user.userId) {
        return res
          .status(400)
          .send({ result: "false", msg: "게시글 작성자만 삭제할 수 있어요!" });
      } else {
        await deleteS3(existPost);
        await Post.deleteOne({ postNum });
        await Comment.deleteMany({ postNum });
        await Like.deleteMany({ postNum });
        await Unlike.deleteMany({ postNum });
        return res.send({ result: "true", msg: "삭제 완료!!" });
      }
    }
    res.status(400).send({ result: "fail", msg: "게시글 삭제 실패ㅠㅠ" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: "fail", msg: "게시글 삭제 실패ㅠㅠ" });
  }
});

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
        const subscribeOne = await Subscribe.findOne({
          userId: userSubId.userId,
        });
        if (subscribeOne === null) {
          continue;
        } else {
          userSub.push(subscribeOne);
        }
      }
      res.status(200).json({ posts, userSub });
    } else {
      res.status(200).json({ posts });
    }
  } catch (error) {
    console.log(error);
    console.log("/api/main에서 에러남");

    res.status(404).json({ result: false });
  }
});

module.exports = router;
