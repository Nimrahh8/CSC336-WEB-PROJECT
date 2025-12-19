const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { applyDiscount } = require('../middleware/discount');

// ---------------------------
// Order Preview
// ---------------------------
router.get('/preview', applyDiscount, (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/checkout');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = subtotal * req.discount;
    const shipping = 5;
    const tax = (subtotal - discountAmount) * 0.10;
    const total = subtotal - discountAmount + shipping + tax;

    res.render('order/preview', {
        title: 'Order Preview',
        cart,
        subtotal,
        discount: req.discount,
        shipping,
        tax,
        total,
        user: req.session.user || {}
    });
});

// ---------------------------
// Confirm Order
// ---------------------------
router.post('/confirm', applyDiscount, async (req, res) => {
    try {
        const cart = req.body.itemsJson ? JSON.parse(req.body.itemsJson) : req.session.cart || [];
        if (!cart.length) return res.status(400).send('Cart is empty.');

        const { fullName, email, phone, address, city, postal, country, coupon } = req.body;
        if (!fullName || !email || !phone || !address || !city || !postal || !country) {
            return res.status(400).send('All customer fields are required.');
        }

        const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
        const discountAmount = subtotal * req.discount;
        const shipping = 5;
        const tax = (subtotal - discountAmount) * 0.10;
        const total = subtotal - discountAmount + shipping + tax;

        const items = cart.map(item => ({
            product: item.name,
            price: Number(item.price),
            quantity: item.quantity || 1
        }));

        const order = new Order({
            items,
            customer: { fullName, email, phone, address, city, postal, country },
            subtotal,
            discount: discountAmount,
            shipping,
            tax,
            total,
            status: 'Placed',
            coupon: coupon || ''
        });

        await order.save();
        req.session.cart = [];

        res.render('order/success', { title: 'Order Confirmed', order });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// ---------------------------
// Customer Order History Form
// ---------------------------
router.get('/my-orders', (req, res) => {
    res.render('order/myOrdersForm', { title: 'My Orders', orders: [], email: '' });
});

router.post('/my-orders', async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) return res.status(400).send('Email is required.');

        const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });

        res.render('order/myOrdersForm', { title: 'My Orders', orders, email });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
