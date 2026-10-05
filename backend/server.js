require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const carRoutes = require('./src/routes/carRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Connect to MongoDB (or fallback to demo/memory mode)
connectDB();

// Root health & meta endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'DriveNearby AI Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      drivers: ['GET /api/drivers/nearby?lat={lat}&lng={lng}&radius={radius}&sortBy={sortBy}', 'GET /api/drivers/:id'],
      cars: ['GET /api/cars/nearby?lat={lat}&lng={lng}&radius={radius}', 'GET /api/cars/combos', 'GET /api/cars/:id'],
      bookings: ['POST /api/bookings', 'GET /api/bookings', 'GET /api/bookings/:id', 'PATCH /api/bookings/:id/status'],
      reviews: ['POST /api/reviews', 'GET /api/reviews/target/:targetId'],
      recommendations: ['GET /api/recommendations?lat={lat}&lng={lng}'],
    },
    message: 'Intelligent Mobility & Trust System running smoothly.',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);

// 404 & Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DriveNearby AI Backend Server running on http://localhost:${PORT}`);
  console.log(`📱 Ready to serve mobile requests for Nearby Drivers, Cars, Combos and AI Trust engine`);
});
