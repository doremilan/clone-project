const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://tslee1379:myteambest1379@cluster0.gnxiz.mongodb.net/miniProject?retryWrites=true&w=majority",
      { ignoreUndefined: true }
    )
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connect;
