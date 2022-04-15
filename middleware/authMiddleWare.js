const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const fs = require("fs");
const myKey = fs.readFileSync(__dirname + "/key.txt").toString();

module.exports = (req, res, next) => {
  const Token = req.headers.authorization;
  const logInToken = Token.replace("Bearer", "");

  try {
    const token = jwt.verify(logInToken, myKey);
    const userId = token.userId;

    User.findOne({ userId })
      .exec()
      .then((user) => {
        res.locals.user = user;
        //로컬의 DB에 있는 유저 정보를 가지고 있음.
        res.locals.token = logInToken;
        //로컬에 존재하는 로그인 토큰
        next();
      });
  } catch (error) {
    console.log("여기서 에러난거같음");
    res.status(401).json({ result: "토큰이 유효하지 않습니다." });
    return;
  }
};
//미들웨어를 거치면 인증이 끝남.
