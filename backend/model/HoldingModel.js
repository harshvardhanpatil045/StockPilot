const { model } = require("mongoose");

const { HoldingsSchema } = require("../Schema/HoldingsSchema");

const HoldingsModel = model("holdings", HoldingsSchema);

module.exports = { HoldingsModel };