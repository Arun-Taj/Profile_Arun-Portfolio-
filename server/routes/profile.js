const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Profile } = require('../models');

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json(profile);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
