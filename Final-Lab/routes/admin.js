const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const { ensureAdmin, forwardAdmin } = require('../middleware/auth');

// =======================
// LOGIN PAGE
// =======================
router.get('/login', forwardAdmin, (req, res) => {
  res.render('admin/login', { title: 'Admin Login', error: null });
});

// =======================
// LOGIN HANDLE
// =======================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.render('admin/login', { title: 'Admin Login', error: 'Invalid credentials' });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.render('admin/login', { title: 'Admin Login', error: 'Invalid credentials' });
  }

  // ✅ Set session variable consistent with middleware
  req.session.admin = true;
  res.redirect('/admin'); // dashboard
});

// =======================
// DASHBOARD
// =======================
router.get('/', ensureAdmin, async (req, res) => {
  const products = await Product.find();
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    totalProducts: products.length,
    totalRevenue: products.reduce((sum, p) => sum + p.price, 0),
    categories: [...new Set(products.map(p => p.category))].length,
    recentProducts: products.slice(-5).reverse()
  });
});

// =======================
// VIEW PRODUCTS
// =======================
router.get('/products', ensureAdmin, async (req, res) => {
  const products = await Product.find();
  res.render('admin/products', { title: 'Manage Products', products });
});

// =======================
// ADD PRODUCT
// =======================
router.get('/products/add', ensureAdmin, (req, res) => res.render('admin/add-product', { title: 'Add Product' }));

router.post('/products/add', ensureAdmin, async (req, res) => {
  await Product.create(req.body);
  res.redirect('/admin/products');
});

// =======================
// EDIT PRODUCT
// =======================
router.get('/products/edit/:id', ensureAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/edit-product', { title: 'Edit Product', product });
});

router.post('/products/edit/:id', ensureAdmin, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin/products');
});

// =======================
// DELETE PRODUCT
// =======================
router.post('/products/delete/:id', ensureAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});

// =======================
// LOGOUT
// =======================
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

module.exports = router;
