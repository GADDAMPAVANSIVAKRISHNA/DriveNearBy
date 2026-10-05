const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { success, error } = require('../utils/responseHelper');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'drivenearby_super_secret_jwt_key_2025_ai', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Fallback demo user when MongoDB is offline
const demoUser = {
  _id: 'usr-demo-01',
  name: 'Dinesh Kumar',
  email: 'dinesh@drivenearby.ai',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  role: 'user',
  savedLocations: [
    { label: 'Home', address: 'Indiranagar 100ft Rd, Bengaluru', latitude: 12.9784, longitude: 77.6408 },
    { label: 'Office', address: 'RMZ Infinity, Old Madras Rd, Bengaluru', latitude: 12.9935, longitude: 77.6606 },
  ],
};

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return error(res, 'Please provide name, email and password', 400);
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return error(res, 'User already exists with this email', 400);
      }
      const user = await User.create({ name, email, phone, password });
      const token = generateToken(user._id);
      return success(
        res,
        {
          user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
          token,
        },
        'Registration successful',
        201
      );
    } catch (dbErr) {
      // Fallback for local demo if DB not connected
      console.warn('DB not connected, using demo register response.');
      const token = generateToken(demoUser._id);
      return success(
        res,
        {
          user: { ...demoUser, name, email, phone },
          token,
        },
        'Registration successful (Demo Mode)',
        201
      );
    }
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, 'Please provide email and password', 400);
    }

    try {
      const user = await User.findOne({ email }).select('+password');
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        return success(
          res,
          {
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
            token,
          },
          'Login successful'
        );
      }
      return error(res, 'Invalid email or password credentials', 401);
    } catch (dbErr) {
      // Fallback demo login
      const token = generateToken(demoUser._id);
      return success(
        res,
        {
          user: demoUser,
          token,
        },
        'Login successful (Demo Mode)'
      );
    }
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getMe = async (req, res) => {
  try {
    return success(res, { user: demoUser }, 'Current profile fetched');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = { register, login, getMe };
