const express = require('express');
const router = express.Router();

// Checkout page route
router.get('/', (req, res) => {
    const drinks = [
        { id: 1, name: 'Drink 1', price: 5, image: 'promo1.png' },
        { id: 2, name: 'Drink 2', price: 6, image: 'promo2.png' },
        { id: 3, name: 'Drink 3', price: 4, image: 'promo3.png' },
        { id: 4, name: 'Drink 4', price: 7, image: 'promo4.png' }
    ];
    res.render('checkout', { title: 'Checkout - Disco Club', drinks: drinks });
});

// Handle order submission
router.post('/order', (req, res) => {
    const orderData = req.body;
    console.log('Order received:', orderData);
    // Here you can add database logic to save the order
    res.json({
        success: true,
        message: 'Order placed successfully!',
        orderId: Math.floor(Math.random() * 10000)
    });
});

module.exports = router;
