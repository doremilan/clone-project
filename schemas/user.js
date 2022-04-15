const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userPw: {
    type: String,
    required: true,
  },
  userNick: {
    type: String,
    required: true,
  },
  userProfile: {
    type: String,
  },
  userSubscribe: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
