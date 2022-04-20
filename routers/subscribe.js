const express = require("express");
const router = express.Router();
const Subscribe = require("../schemas/subscribe");
const User = require("../schemas/user");
const authMiddleware = require("../middleware/authMiddleWare");

// 구독
router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { userSub, subCheck } = req.body;
    console.log(subCheck)

    if (subCheck) {
      await User.updateOne(
        { userId: userSub },
        { $inc: { userSubscribe: -1 } }
      );
      await Subscribe.deleteOne({ userSub, userId });
    } else {
      await User.updateOne({ userId: userSub }, { $inc: { userSubscribe: 1 } });
      await Subscribe.create({ userSub, userId });
    }

    res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    console.log("subscribe.js 구독에서 에러남");

    res.status(400).json({ result: false });
  }
});

module.exports = router;
