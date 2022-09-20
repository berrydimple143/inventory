const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const moment = require("moment");
router.post("/add-product", async function (req, res) {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send("Product added successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/edit-product", async function (req, res) {
  try {
    await Product.findOneAndUpdate({_id : req.body.productId} , req.body.payload)
    res.send("Product updated successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/delete-product", async function (req, res) {
  try {
    await Product.findOneAndDelete({_id : req.body.productId})
    res.send("Product deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/get-all-products", async (req, res) => {
  const { frequency, selectedRange , type } = req.body;
  try {
    const Products = await Product.find({
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

    res.send(Products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
