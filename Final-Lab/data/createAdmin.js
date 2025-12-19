const mongoose = require('mongoose');
const Admin = require('../models/Admin');

mongoose.connect('mongodb://127.0.0.1:27017/discoDB')
  .then(async () => {
    const exists = await Admin.findOne({ username: 'admin' });

    if (exists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });

    await admin.save();
    console.log('✅ Admin created: admin / admin123');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
