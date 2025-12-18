const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }, // path to image in /public/images/
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
