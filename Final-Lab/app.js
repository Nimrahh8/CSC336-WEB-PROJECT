const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3000;

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/discoDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Sessions
app.use(session({ secret: 'secret123', resave: false, saveUninitialized: false }));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Views
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/checkout', require('./routes/checkout'));
app.use('/order', require('./routes/order'));

// Admin routes
app.use('/admin', (req, res, next) => {
  res.locals.layout = 'admin/layout';
  next();
}, require('./routes/admin'));

app.use('/admin/orders', (req, res, next) => {
  res.locals.layout = 'admin/layout';
  next();
}, require('./routes/adminOrders'));

// 404 handler
app.use((req, res) => res.status(404).send('404 - Page Not Found'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

module.exports = app;
