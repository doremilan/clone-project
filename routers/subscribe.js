const express = require("express");
const router = express.Router();
const subscribe = require("../schemas/subscribe");

router.post("/subscribe", (req, res) => {
  subscribe
    .find({
      userId: req.body.userId,
      userSub: req.body.userSub,
    })
    .exec((err, subscribe) => {
      if (err) res.status(400).send(err);
      let result = false;
      if (subscribe.length !== 0) {
        result = true;
      }
      res.status(200).json({ success: true, subscribe: result });
    });
});

module.exports = router;
