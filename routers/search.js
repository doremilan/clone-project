const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const User = require("../schemas/user");
const Subscribe = require("../schemas/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const myKey = fs.readFileSync(__dirname + "/../middleware/key.txt").toString();

// 검색
router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    let posts = await Post.find({ postTitle: { $regex: keyword } }).sort({
      postDate: -1,
    });

    for (let user of posts) {
      let userInfo = await User.findOne({ userId: user.userId });
      userInfo.userPw = "";
      user.userInfo = userInfo;
    }

    const userSub = [];
    const Token = req.headers.authorization;
    if (Token) {
      const logInToken = Token.replace("Bearer", "");

      const token = jwt.verify(logInToken, myKey);
      const userId = token.userId;
      const userSubIds = await Subscribe.findOne({ userId });

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
    }

    res.status(200).json({ posts, userSub });
  } catch (error) {
    console.log(error);
    console.log("search.js 검색에서 에러남");

    res.status(400).json({ result: false });
  }
});

module.exports = router;
