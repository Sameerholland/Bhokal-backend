const mongoose = require("mongoose");
const { Schema } = mongoose;

const newsletterSchema = new Schema({
  email: { type: String, required: true },
});

exports.newsletter = mongoose.model("newletter", newsletterSchema);
