const { Schema } = require("mongoose");

const PositionSchema = new Schema({
  userId: {
    type: String,
    default: null,
  },
  product: String,
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  isLoss: Boolean,
});

module.exports = { PositionSchema };