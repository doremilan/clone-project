const mongoose = require("mongoose");

const subscribeSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userSub: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("subscribe", subscribeSchema);
