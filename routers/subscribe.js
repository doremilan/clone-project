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
  //   Subscribe
  //     .find({
  //       userId: req.body.userId,
  //       userSub: req.body.userSub,
  //     })
  //     .exec((err, subscribe) => {
  //       if (err) res.status(400).send(err);
  //       let result = false;
  //       if (subscribe.length !== 0) {
  //         result = true;
  //       }
  //       res.status(200).json({ success: true, subscribe: result });
  //     });
});

module.exports = router;
