const { model } = require("mongoose");

const {PositionSchema} = require("../Schema/PositionSchema");

const PositionModel = new model("Position", PositionSchema);

module.exports = {PositionModel};