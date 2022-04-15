const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { upload } = require("../middlewares/upload");
const user = require("../schemas/user");

// 게시글 조회
router.get("/posts/:postNum", async (req, res) => {
  //postId -> postNum으로 수정..? / 좋아요 싫어요 구독 check시 유저정보 어떻게 구하징..
  try {
    const { postNum } = req.params;

    const postDetails = await Post.find({ postNum });
    postDetails.postCnt + 1; //postCnt 추가
    await postDetails.save(); //추가한 값 저장

    const postComments = await Comment.find({ postNum });
    const totalLike = await Like.find({ postNum });

    likeCheck;
    unlikeCheck;
    subscribeCheck;

    res
      .status(200)
      .json({ result: "true", postDetails, postComments, totalLike });
  } catch (error) {
    res.status(404).send({ result: "false", msg: "게시글 조회 실패ㅠㅠ" });
  }
});

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
      const { user } = res.locals;
      const { postTitle, postDesc } = req.body;
      const postVideo = req.files.videoFile.location;
      const postThumb = req.files.imageFile.location;
      const postDate = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");

      const postAmount = await Post.find();

      if (postAmount.length) {
        const postSorted = postAmount.sort((a, b) => b.postNum - a.postNum);
        const MaxPostNum = postSorted[0]["postId"];
        const postNum = MaxPostNum + 1;
        // const postCommentNum = 0; //required 지우고 default 값 지정해놓으면 안써도 될까..?
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
          userInfo: user,
          userId: user.userId,
        });
      } else {
        const postNum = 1;
        // const postCommentNum = 0; //required 지우고 default 값 지정해놓으면 안써도 될까..?
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
          userInfo: user,
          userId: user.userId, //userInfo는 리스폰스만,, 디비저장 놉
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

module.exports = router;
