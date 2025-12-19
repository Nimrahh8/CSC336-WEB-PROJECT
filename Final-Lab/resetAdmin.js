const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect('mongodb://127.0.0.1:27017/discoDB')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Delete existing admin
    await Admin.deleteMany({ username: 'admin' });
    console.log('✅ Deleted old admin');

    // Create new admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });

    await admin.save();
    console.log('✅ New admin created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('');
    console.log('You can now login with these credentials.');
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });