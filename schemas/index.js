const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://soldier:soldierproject@cluster0.plr85.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      { ignoreUndefined: true }
    )
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connect;
