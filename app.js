const express = require("express");
const connect = require("./schemas/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;

connect();

// 라우터 불러오기
const postRouter = require("./routers/posts");
const likeRouter = require("./routers/likes");
const searchRouter = require("./routers/search");
const commentRouter = require("./routers/comments");
const userRouter = require("./routers/users");
const subscribeRouter = require("./routers/subscribe");

// 접속 로그 남기기
const requestMiddleware = (req, res, next) => {
  console.log(
    "[Ip address]:",
    req.ip,
    "[method]:",
    req.method,
    "Request URL:",
    req.originalUrl,
    " - ",
    new Date()
  );
  next();
};

// 각종 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(requestMiddleware);
app.use(express.urlencoded({ extended: false }));

// 라우터 연결
app.use("/api", [
  postRouter,
  subscribeRouter,
  likeRouter,
  searchRouter,
  commentRouter,
]);
app.use("/user", [userRouter]);

app.get("/.well-known/pki-validation/3E8040004D63B5806FC90DA247FE5C22.txt",(req,res)=> {
  res.sendFile(__dirname + "/well-known/pki-validation/3E8040004D63B5806FC90DA247FE5C22.txt")
})

// 서버 열기
app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요!");
});
