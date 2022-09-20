const express = require("express");
const User = require("../models/User");
const router = express.Router();
const moment = require("moment");
router.post("/add-client", async function (req, res) {
  try {
    const newClient = new User(req.body);
    await newClient.save();
    res.send("Client added successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/edit-client", async function (req, res) {
  try {
    await User.findOneAndUpdate({_id : req.body.clientId} , req.body.payload)
    res.send("Client updated successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/delete-client", async function (req, res) {
  try {
    await User.findOneAndDelete({_id : req.body.clientId})
    res.send("Client deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/get-all-clients", async (req, res) => {
  const { frequency, selectedRange , type } = req.body;
  try {
    const Clients = await User.find({
      ...(frequency !== "custom"
        ? {
            createdAt: {
              $gt: moment().subtract(Number(req.body.frequency), "d").toDate(),
            },
          }
        : {
            createdAt: {
              $gte: selectedRange[0],
              $lte: selectedRange[1],
            },
          }),
      userid: req.body.userid,
      ...(type!=='all' && {type})
    });

    res.send(Clients);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
