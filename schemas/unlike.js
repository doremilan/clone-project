const mongoose = require("mongoose");

const unlikeSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postNum: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Unlike", unlikeSchema);
