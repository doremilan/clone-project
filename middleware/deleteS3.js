const AWS = require("aws-sdk");
require("dotenv").config();

module.exports = (post) => {
  console.log("삭제미들웨어:", post);
  const uri1 = post.postThumb.split("/").slice(-1);
  const uri2 = post.postVideo.split("/").slice(-1);
  const key1 = "images/" + decodeURI(uri1);
  const key2 = "videos/" + decodeURI(uri2);
  console.log(key1, key2);
  const s3 = new AWS.S3();

  const params = {
    Bucket: "doremilanbucket",
    Delete: {
      Objects: [{ Key: key1 }, { Key: key2 }],
      Quiet: false,
    },
  };
  s3.deleteObjects(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};
