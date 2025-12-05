const express = require("express");
const VitalSign = require("../models/VitalSign");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all vitals of logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const vitals = await VitalSign.find({ user: req.userId }).sort("createdAt");
    res.json(vitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE new vitals
router.post("/", auth, async (req, res) => {
  try {
    const { heartRate, systolic, diastolic, oxygen, temperature } = req.body;

    const vital = await VitalSign.create({
      user: req.userId,
      heartRate,
      systolic,
      diastolic,
      oxygen,
      temperature,
    });

    res.status(201).json(vital);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
