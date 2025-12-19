const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// CRUD Page - List Products with optional filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const category = req.query.category || '';
    const minPricePKR = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    const maxPricePKR = req.query.maxPrice ? parseFloat(req.query.maxPrice) : 10000;

    // Convert PKR to USD
    const conversionRate = 300; // 1 USD = 300 PKR
    const minPriceUSD = minPricePKR / conversionRate;
    const maxPriceUSD = maxPricePKR / conversionRate;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    filter.price = { $gte: minPriceUSD, $lte: maxPriceUSD };

    // Count total products
    const total = await Product.countDocuments(filter);

    // Fetch products with pagination
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.render('crud', {
      title: 'CRUD - Products',
      products,
      page,
      pages: Math.ceil(total / limit),
      category,
      minPrice: minPricePKR,
      maxPrice: maxPricePKR
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
