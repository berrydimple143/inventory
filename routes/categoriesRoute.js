const express = require("express");
const Category = require("../models/Category");
const router = express.Router();
const moment = require("moment");
router.post("/add-category", async function (req, res) {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.send("Category added successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/edit-category", async function (req, res) {
  try {
    await Category.findOneAndUpdate({_id : req.body.categoryId} , req.body.payload)
    res.send("Category updated successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/delete-category", async function (req, res) {
  try {
    await Category.findOneAndDelete({_id : req.body.categoryId})
    res.send("Category deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/get-all-categories", async (req, res) => {
  const { frequency, selectedRange , type } = req.body;
  try {
    const Categories = await Category.find({
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

    res.send(Categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
