const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose.connect('mongodb://127.0.0.1:27017/discoDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// ---------------------------
// Session middleware
// ---------------------------
app.use(session({
  secret: 'yourSecretKey123',
  resave: false,
  saveUninitialized: false
}));

// Make session available in views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------------------------
// View engine
// ---------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main'); // ✅ FIXED PATH

// ---------------------------
// Static files
// ---------------------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------
// Routes
// ---------------------------
const indexRouter = require('./routes/index');
const checkoutRouter = require('./routes/checkout');
const adminRouter = require('./routes/admin');

app.use('/', indexRouter);
app.use('/checkout', checkoutRouter);

// Admin layout
app.use('/admin', (req, res, next) => {
  app.set('layout', 'admin/layout');
  next();
}, adminRouter);

// ---------------------------
// 404
// ---------------------------
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// ---------------------------
// Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
