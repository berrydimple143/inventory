const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userid : { type: String, required: true},
  name: { type: String, required: true },
  description: { type: String, required: false },
  buy_price: { type: Number, required: true },
  sell_price: { type: Number, required: true },
  stock: { type: Number, required: true },  
  image: { type: String, required: false },
  category: { type: String, required: true },    
}, { timestamps: true });

module.exports = mongoose.model("Products", productSchema);
