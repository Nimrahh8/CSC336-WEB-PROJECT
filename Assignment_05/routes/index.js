const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('index', { title: 'Home - My E-Commerce Store' });
});

module.exports = router;
