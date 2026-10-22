const { Schema } = require("mongoose");

const OrderSchema = new Schema({
  userId: {
    type: String,
    default: null,
  },
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { OrderSchema };