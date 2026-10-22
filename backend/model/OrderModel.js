const { model } = require("mongoose");

const {OrderSchema} = require("../schema/OrderSchema");

const OrderModel = new model("Order", OrderSchema);

module.exports = {OrderModel};