const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/discoDB');

const products = [
  { name: 'Drink 1', price: 5, category: 'Drinks', image: 'promo1.png', description: 'Tasty drink 1' },
  { name: 'Drink 2', price: 6, category: 'Drinks', image: 'promo2.png', description: 'Tasty drink 2' },
  { name: 'Drink 3', price: 4, category: 'Drinks', image: 'promo3.png', description: 'Tasty drink 3' },
  { name: 'Drink 4', price: 7, category: 'Drinks', image: 'promo4.png', description: 'Tasty drink 4' }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Products seeded');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
