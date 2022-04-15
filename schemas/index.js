const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://project:clone@clonecodings.kked2.mongodb.net/clonecodings?retryWrites=true&w=majority",
      { ignoreUndefined: true }
    )
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connect;
