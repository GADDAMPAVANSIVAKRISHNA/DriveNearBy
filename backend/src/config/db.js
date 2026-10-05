const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr || connStr.includes('<username>')) {
      console.warn('⚠️ MongoDB URI not configured in .env. Operating in Mock/Demo Mode.');
      return false;
    }
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Continuing with fallback memory/mock services.');
    return false;
  }
};

module.exports = connectDB;
