const AWS = require("aws-sdk");
const { ACCESSKEYID, SECRETACCESSKEY, REGION, ENDPOINT } = process.env;

module.exports = (post) => {
  console.log(post);
  const uri1 = post[0].postThumb.split("/").slice(-1);
  const uri2 = post[0].postVideo.split("/").slice(-1);
  const key1 = "images/" + decodeURI(uri1);
  const key2 = "videos/" + decodeURI(uri2);

  const S3 = new AWS.S3({
    accessKeyId: ACCESSKEYID,
    secretAccessKey: SECRETACCESSKEY,
    region: REGION,
    endpoint: ENDPOINT,
  });

  const params = {
    Bucket: "doremilanbucket",
    // // Delete: {
    //   Objects: [{ Key: key1 }, { Key: key2 }],
    //   Quiet: false,
    // },
    Key: key1,
  };
  S3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};
