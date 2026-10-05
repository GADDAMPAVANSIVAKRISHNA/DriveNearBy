const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseHelper');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return error(res, 'Not authorized, no access token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'drivenearby_super_secret_jwt_key_2025_ai');
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Not authorized, token failed or expired', 401);
  }
};

module.exports = { protect };
