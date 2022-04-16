const AWS = require("aws-sdk");

module.exports = (post) => {
  const uri1 = post.postThumb.split("/").slice(-1);
  const uri2 = post.postVideo.split("/").slice(-1);
  const key1 = "images/" + decodeURI(uri1);
  const key2 = "videos/" + decodeURI(uri2);

  const S3 = new AWS.S3();

  const params = {
    Bucket: "doremilanbucket",
    Delete: {
      Objects: [{ Key: key1 }, { Key: key2 }],
      Quiet: false,
    },
  };
  S3.deleteObjects(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};
