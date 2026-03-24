const connectDB = require('./config/database');
const User = require('./models/User');
require('dotenv').config();
(async () => {
  await connectDB();
  const admins = await User.find({ role: 'admin' }).select('email name role').lean();
  console.log('admins', admins);
  process.exit(0);
})();