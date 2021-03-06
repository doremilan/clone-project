const express = require("express");
const router = express.Router();
const fs = require("fs");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleWare");
// 키 가져오는 코드
const myKey = fs.readFileSync(__dirname + "/../middleware/key.txt").toString();
// 프로필 사진 URL 가져오는 코드
const initProfile = fs.readFileSync(__dirname + "/initProfile.txt").toString();

//초기 썬더 클라이언트 테스트용도
router.get("/test", (req, res) => {
  console.log("가냐?");
  res.send("잘가는거같다");
});

//User가 로그인 요청시 사용하는 API입니다.
//썬더 클라이언트 테스트 데이터로 확인 완료
router.post("/login", async (req, res) => {
  try {
    const { userId, userPw } = req.body;
    const user = await User.findOne({ userId, userPw });

    if (!user) {
      res.status(400).json({
        errorMessage: "아이디 비밀번호를 확인해주세요.",
      });
      return;
    }

    //userInfo : 아이디,비밀번호등 사용자 정보 Object
    //expiresIn : 토큰 만료일, issuer,subject : 토큰에 대한 정보
    const options = {
      expiresIn: "1d",
      issuer: "CloneProject",
      subject: "userInfo",
    };
    const payload = { userId };
    const secret = myKey;
    //jwt.sign()비동기 함수
    const token = jwt.sign(payload, secret, options);
    res.status(200).json({ result: true, loginToken: token });
  } catch (error) {
    console.log(error);
    console.log("users.js 로그인에서 에러남");

    res.status(400).json({ result: false });
  }
});

//User가 회원가입 요청시 사용하는 API입니다.
//썬더클라이언트 테스트데이터로 확인 완료
router.post("/signup", async (req, res) => {
  try {
    const { userId, userPw, userNick } = req.body;
    const existUsers = await User.findOne({ userId });
    const userProfile = initProfile;

    //동일한 계정이 있으면 호출하는 메시지 입니다.
    //썬더 클라이언트 -  테스트데이터로 확인 완료
    if (existUsers) {
      res.status(400).send({
        errorMessage: "동일한 아이디가 있습니다.",
      });
    }
    //회원가입이 성공하게되면 호출하는 메시지 입니다.
    //썬더 클라이언트 -  테스트데이터로 확인 완료
    await User.create({ userId, userPw, userNick, userProfile });
    console.log(`${userId}님이 가입하셨습니다.`);
    res.status(200).send({ result: true });
  } catch (error) {
    console.log(error);
    console.log("users.js 회원가입에서 에러남");

    res.status(400).json({ result: false });
  }
});

//로그인 체크
router.get("/islogin", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.status(200).send({
    user,
  });
});

module.exports = router;
