const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const RFQSchema = new mongoose.Schema({
  title: String,
  product: String,
  qty: Number,
  deadline: String,
  vendors: String,
  status: { type: String, default: 'Open' }
}, { timestamps: true });

const RFQ = mongoose.model('RFQ', RFQSchema);

router.get('/', async (req, res) => {
  const rfqs = await RFQ.find();
  res.json(rfqs);
});

router.post('/', async (req, res) => {
  try {
    const rfq = await RFQ.create(req.body);
    res.json(rfq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;