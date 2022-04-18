const AWS = require("aws-sdk");
require("dotenv").config();

module.exports = (post) => {
  console.log("삭제미들웨어:", post);
  const uri1 = post.postThumb.split("/").slice(-1);
  const uri2 = post.postVideo.split("/").slice(-1);
  // 띄어쓰기가 +로 나오기 때문에 띄어쓰기로 replace
  const key1 = "images/" + decodeURI(uri1).replaceAll("+", " ");
  const key2 = "videos/" + decodeURI(uri2).replaceAll("+", " ");
  console.log(key1, key2);

  const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  s3.deleteObject(
    {
      Bucket: "clonecoding",
      Key: key1,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data);
    }
  );
  s3.deleteObject(
    {
      Bucket: "clonecoding",
      Key: key2,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data);
    }
  );
};
