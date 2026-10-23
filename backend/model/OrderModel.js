const { model } = require("mongoose");

const {OrderSchema} = require("../Schema/OrderSchema");

const OrderModel = new model("Order", OrderSchema);

module.exports = {OrderModel};