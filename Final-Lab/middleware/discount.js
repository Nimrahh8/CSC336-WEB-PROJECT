// Middleware to apply discount
function applyDiscount(req, res, next) {
    let discount = 0;
    const code = req.query.coupon || req.body.coupon;
    if (code && code.toUpperCase() === 'SAVE10') {
        discount = 0.1; // 10%
    }
    req.discount = discount;
    next();
}

module.exports = { applyDiscount };
