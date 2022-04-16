const express = require("express");
const router = express.Router();
const Subscribe = require("../schemas/subscribe");
const User = require("../schemas/user");
const authMiddleware = require("../middleware/authMiddleWare");

router.post("/subscribe", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { userSub, subCheck } = req.body;

  if (subCheck) {
    await User.updateOne({ userId: userSub }, { $inc: { userSubscribe: -1 } });
    await Subscribe.deleteOne({ userSub, userId });
  } else {
    await User.updateOne({ userId: userSub }, { $inc: { userSubscribe: 1 } });
    await Subscribe.create({ userSub, userId });
  }

  res.status(200).json({ result: true });
});

module.exports = router;
