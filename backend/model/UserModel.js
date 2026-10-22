const { model } = require("mongoose");
const { UserSchema } = require("../Schema/UserSchema");

const UserModel = new model("User", UserSchema);

module.exports = { UserModel };
