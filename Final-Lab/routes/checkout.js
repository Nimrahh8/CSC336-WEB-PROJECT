const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const category = req.query.category || '';
        const minPricePKR = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
        const maxPricePKR = req.query.maxPrice ? parseFloat(req.query.maxPrice) : 10000;

        const conversionRate = 300;
        const minPriceUSD = minPricePKR / conversionRate;
        const maxPriceUSD = maxPricePKR / conversionRate;

        const filter = {};
        if (category && category.trim() !== '') filter.category = category;
        filter.price = { $gte: minPriceUSD, $lte: maxPriceUSD };

        const total = await Product.countDocuments(filter);
        const drinks = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        console.log('Products fetched:', drinks.length); // Debugging

        res.render('checkout', {
            title: 'Checkout - Disco Club',
            drinks,
            page,
            pages: Math.ceil(total / limit),
            category,
            minPrice: minPricePKR,
            maxPrice: maxPricePKR
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Server Error: Unable to fetch products');
    }
});

module.exports = router;
