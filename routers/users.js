const express = require("express");
const router = express.Router();
const fs = require("fs");
// 키 가져오는 코드
const myKey = fs.readFileSync(__dirname + "/../middleware/key.txt").toString();
// 프로필 사진 URL 가져오는 코드
const initProfile = fs.readFileSync(__dirname + "/initProfile.txt").toString();

module.exports = router;
