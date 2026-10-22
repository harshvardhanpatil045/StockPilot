const { model } = require("mongoose");

const {HoldingsSchema} = require("../schema/HoldingsSchema");

const HoldingsModel = new model("holdings", HoldingsSchema);

module.exports = {HoldingsModel};