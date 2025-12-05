const mongoose = require("mongoose");

const vitalSignSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    heartRate: Number,
    systolic: Number,
    diastolic: Number,
    oxygen: Number,
    temperature: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("VitalSign", vitalSignSchema);
