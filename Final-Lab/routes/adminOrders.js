const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { ensureAdmin } = require('../middleware/auth');

// =======================
// LIST ALL ORDERS
// =======================
router.get('/', ensureAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render('admin/orders', { title: 'Manage Orders', orders });
});

// =======================
// UPDATE ORDER STATUS
// =======================
router.post('/update/:id', ensureAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('Order not found');

    const allowed = { Placed: ['Processing'], Processing: ['Delivered'], Delivered: [] };
    if (!allowed[order.status].includes(req.body.status))
      return res.status(400).send('Invalid status transition');

    order.status = req.body.status;
    await order.save();
    res.redirect('/admin/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
