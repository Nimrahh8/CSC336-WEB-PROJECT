const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            product: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    customer: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        address: String,
        city: String,
        postal: String,
        country: String
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 5 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Placed','Processing','Delivered'], default: 'Placed' },
    coupon: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
