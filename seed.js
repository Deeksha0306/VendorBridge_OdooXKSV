require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected!');
  
  const hashed = await bcrypt.hash('admin123', 10);
  
  await mongoose.connection.collection('users').insertOne({
    name: 'Admin User',
    email: 'admin@vendor.com',
    password: hashed,
    role: 'Procurement Officer'
  });
  
  console.log('Admin user created!');
  process.exit();
}).catch(err => console.log(err));