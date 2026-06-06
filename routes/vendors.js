const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: String,
  category: String,
  gst: String,
  contact: String,
  status: { type: String, default: 'Active' },
  rating: { type: String, default: '4.0⭐' }
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', VendorSchema);

router.get('/', async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
});

router.post('/', async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;