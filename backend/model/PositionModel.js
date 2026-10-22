const { model } = require("mongoose");

const {PositionSchema} = require("../schema/PositionSchema");

const PositionModel = new model("Position", PositionSchema);

module.exports = {PositionModel};