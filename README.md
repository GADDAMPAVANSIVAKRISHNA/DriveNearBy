# 🚗 DriveNearby AI

> **Intelligent Location-Based Mobility Platform** with Transparent AI Recommendation & Dynamic Trust Rating System. Built with **React Native (Expo)** and **Node.js + Express + MongoDB**.

---

## 🌟 Product Concept & Differentiator

DriveNearby AI helps urban commuters discover and book verified mobility solutions nearby:
1. 👨‍✈️ **Verified Professional Drivers** (Hourly / Daily Chauffeurs)
2. 🚗 **Self-Drive Rental Cars** (SUVs, Compact SUVs, Sedans)
3. 🚘 **Car + Driver Bundled Combos** (All-in-one vehicle + navigator with bundle discounts)

### 🤖 Intelligent Trust & Multi-Objective AI Match System
Rather than merely sorting by highest star rating, DriveNearby AI calculates an explainable **AI Match Score (0-100%)** combining:
- **Proximity**: Real-time distance from user GPS location
- **Trust Score**: Multi-dimensional trust score evaluated on verified trip volume, zero-cancellation record, and police ID verification
- **Granular Criteria**: Driving safety, punctuality, behaviour, and vehicle cleanliness
- **Dynamic Feedback Loop**: After every completed journey, submitting a review dynamically recalculates the driver's trust score, increments verified completed trips, and immediately updates future AI rankings.

---

## 📁 Project Structure

```text
DriveNearby AI/
├── package.json                   # Root orchestrator scripts (run mobile & backend)
├── README.md                      # Comprehensive documentation
│
├── mobile/                        # React Native + Expo Mobile Application
│   ├── App.js                     # Root entry with Navigation & State Providers
│   ├── app.json                   # Expo configuration & location permissions
│   ├── package.json
│   ├── .env.example               # Mobile API URL configurations
│   └── src/
│       ├── constants/
│       │   ├── theme.js           # Design tokens, color palette, shadows, spacing
│       │   └── mockData.js        # Indian demo mobility data (drivers, cars, combos, trips)
│       ├── services/
│       │   ├── api.js             # Axios client with timeout & auto fallback
│       │   ├── authService.js     # Auth & AsyncStorage session manager
│       │   ├── driverService.js   # Nearby driver queries, filters & local fallback
│       │   ├── carService.js      # Rental cars & combo packages
│       │   ├── bookingService.js  # Booking creation & status lifecycle manager
│       │   ├── reviewService.js   # Dynamic review submission & trust score delta
│       │   ├── locationService.js # Expo Location GPS & reverse geocoding
│       │   └── recommendationService.js # Multi-factor recommendation engine
│       ├── context/
│       │   ├── AuthContext.js     # User session state
│       │   ├── LocationContext.js # GPS location & permission state
│       │   └── BookingContext.js  # Real-time bookings, trip simulation & trust delta
│       ├── components/
│       │   ├── LocationHeader.js  # User avatar, greeting & GPS indicator
│       │   ├── InteractiveMap.js  # Cross-platform radar map with dynamic pins
│       │   ├── DriverCard.js      # Driver card with AI badges & quick booking
│       │   ├── CarCard.js         # Rental vehicle card with specs & distance
│       │   ├── ComboCard.js       # Car + Driver dual package card
│       │   ├── BookingCard.js     # Multi-state trip card with live tracker & rate button
│       │   ├── RatingStars.js     # Interactive & display star ratings
│       │   ├── TrustScoreBadge.js # Transparent trust score badge & modal breakdown
│       │   ├── TrustDeltaCelebrationModal.js # Live before-and-after trust score update
│       │   ├── RecommendationCard.js # Featured AI match card with explainability
│       │   ├── SearchBar.js       # Search input with filter trigger
│       │   ├── FilterModal.js     # Modal for sorting & filtering by distance/price/rating
│       │   ├── ReviewCard.js      # Rider testimonials
│       │   ├── PrimaryButton.js   # Themed buttons with loading states
│       │   ├── VerificationBadge.js # Government verified badge
│       │   └── LoadingState.js    # Loading & empty states
│       ├── screens/
│       │   ├── auth/
│       │   │   ├── SplashScreen.js
│       │   │   ├── LoginScreen.js
│       │   │   └── RegisterScreen.js
│       │   └── main/
│       │       ├── HomeScreen.js
│       │       ├── ExploreScreen.js
│       │       ├── NearbyDriversScreen.js
│       │       ├── NearbyCarsScreen.js
│       │       ├── CarDriverScreen.js
│       │       ├── DriverDetailsScreen.js
│       │       ├── CarDetailsScreen.js
│       │       ├── BookingScreen.js
│       │       ├── BookingConfirmationScreen.js
│       │       ├── ActiveTripScreen.js
│       │       ├── TripCompletedScreen.js
│       │       ├── RatingReviewScreen.js
│       │       ├── BookingsScreen.js
│       │       └── ProfileScreen.js
│       └── navigation/
│           ├── AppNavigator.js    # Stack navigator for all screens
│           └── TabNavigator.js    # Bottom tabs (Home, Explore, Bookings, Profile)
│
└── backend/                       # Node.js + Express + MongoDB Architecture
    ├── server.js                  # Express API server entry point
    ├── package.json
    ├── .env.example
    └── src/
        ├── config/
        │   └── db.js              # MongoDB Atlas connection with fallback mode
        ├── models/
        │   ├── User.js            # User schema with bcrypt password hashing
        │   ├── Driver.js          # Driver schema with 2dsphere location index & trust
        │   ├── Car.js             # Vehicle schema with rental specs & location index
        │   ├── Booking.js         # Full trip lifecycle schema
        │   └── Review.js          # Multi-criteria ratings & trust score delta schema
        ├── controllers/
        │   ├── authController.js
        │   ├── driverController.js
        │   ├── carController.js
        │   ├── bookingController.js
        │   ├── reviewController.js
        │   ├── recommendationController.js
        │   └── userController.js
        ├── services/
        │   ├── aiRecommendationService.js # Multi-objective match scoring algorithm
        │   └── trustScoreService.js       # Transparent trust formula (0-100)
        ├── routes/
        │   ├── authRoutes.js
        │   ├── driverRoutes.js
        │   ├── carRoutes.js
        │   ├── bookingRoutes.js
        │   ├── reviewRoutes.js
        │   ├── recommendationRoutes.js
        │   └── userRoutes.js
        ├── middleware/
        │   ├── authMiddleware.js  # JWT Bearer token protection
        │   └── errorMiddleware.js # Standardized error handling
        └── utils/
            ├── responseHelper.js  # Standardized API response format
            └── seedData.js        # Realistic Indian seed data (Ravi Kumar, Creta, etc.)
```

---

## 🚀 Commands to Run the Application

### 1. Frontend (Mobile App - Expo)

Navigate to the `mobile` directory (or use root shortcuts):

```bash
# Option A: From root directory
npm run start        # Launches Expo Metro Bundler

# Option B: Run on Web browser immediately
npm run web

# Option C: Run on Android Emulator or physical device
npm run android

# Direct Expo commands:
cd mobile
npx expo start
```

*To run on your physical Android/iOS phone:*
1. Install **Expo Go** from Google Play Store or Apple App Store.
2. Scan the QR code displayed in your terminal.

---

### 2. Backend (Node.js + Express API)

Navigate to the `backend` directory (or use root shortcuts):

```bash
# Option A: From root directory
npm run server       # Starts server on http://localhost:5000

# Option B: Development mode with nodemon
npm run server:dev

# Option C: Direct backend command
cd backend
node server.js
```

Backend health check:
```bash
curl http://localhost:5000/
curl http://localhost:5000/api/drivers/nearby
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/drivenearby?retryWrites=true&w=majority
JWT_SECRET=drivenearby_super_secret_jwt_key_2025_ai
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:8081
```
*Note: If `MONGO_URI` is omitted or unconfigured, the backend automatically and seamlessly operates in high-fidelity mock/memory mode with zero crashes!*

### Mobile (`mobile/.env`)
Copy `mobile/.env.example` to `mobile/.env`:
```ini
# When testing via Web:
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# When testing via Android Emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# When testing via Physical Phone (replace with your local PC LAN IP):
# EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

---

## 🏆 Hackathon Priority End-to-End Flow (Verified Working)

1. **User Opens App**: Splash Screen loads branding -> detects live location (e.g. Indiranagar, Bengaluru) -> lands on Home Screen.
2. **Find a Driver**: Tap **"Find a Driver"** -> interactive radar map pins and nearby driver cards appear.
3. **AI Recommended Match**: Top match (e.g. **Ravi Kumar - 94% Match**) highlighted with explainable factors ("Ultra-nearby, 4.8★ feedback, 142+ trips").
4. **Driver Profile**: Tap driver -> view verified credentials, police verification status, transparent trust score breakdown, and vehicle competencies.
5. **Book Driver**: Tap **"Book Driver"** -> schedule pickup, destination, duration and confirm fare.
6. **Booking Confirmation**: Real-time allocation -> Booking ID generated (`#DN-xxxxxx`).
7. **Active Trip Simulator**: Tap **"Track Driver & Begin Live Trip"** -> step through states:
   - *Booking Confirmed*
   - *Driver Arriving*
   - *Driver Arrived*
   - *Trip Started*
   - *Trip in Progress*
   - *Trip Completed*
8. **Trip Summary**: Displays distance, duration, paid amount, and **"Rate Your Experience"** CTA.
9. **Rating & Multi-Factor Review**:
   - Overall star rating (1 to 5)
   - Granular ratings: *Driving Skills*, *Punctuality*, *Behaviour*, *Safety*, *Vehicle Cleanliness*
   - Written feedback
10. **Live Trust Score Celebration**:
    - Tap **"Submit Review"** -> **Trust Score Celebration Modal** opens.
    - Displays before-and-after update:
      - Previous Rating: `4.8★` ➔ New Rating: `4.9★`
      - Completed Trips: `142` ➔ `143`
      - Trust Score: `94/100` ➔ `95/100`
    - Driver list and home rankings update dynamically in real time!

---

## ✅ Currently Implemented Features

- [x] Full React Native (Expo) mobile application with React Navigation (Tabs + Stack)
- [x] Complete Node.js + Express + MongoDB Atlas backend architecture with JWT auth
- [x] Expo Location GPS integration with address geocoding & permission handling
- [x] Cross-platform interactive radar map with custom driver & vehicle markers
- [x] Nearby Drivers screen with sorting (AI match, distance, rating, price) & filters
- [x] Nearby Rental Cars screen with category filter (SUV, Compact SUV, Sedan, EV)
- [x] Car + Driver bundled booking screen with package discounts
- [x] Comprehensive Driver & Vehicle Details profiles with badge verification
- [x] End-to-end booking flow with fare calculation & confirmation
- [x] Active Trip tracker with 6-stage lifecycle stepper & simulation engine
- [x] Trip Completion screen with journey summary metrics
- [x] Granular 5-factor rating system with text reviews
- [x] Transparent Trust Score formula & interactive modal breakdown
- [x] Dynamic Trust Score recalculation & live ranking update
- [x] Booking History tab with Active, Completed, and Cancelled filters
- [x] User Profile screen with saved locations and sign out
- [x] 100% offline-ready fallback mode so the mobile app runs without backend dependencies

---

## 🔮 Features Intentionally Prepared for Later Phases

- Production payment gateway integration (Razorpay / Stripe)
- Live WebSocket / Socket.IO tracking stream (architecture already prepared in booking controller)
- Dedicated Driver & Vehicle Fleet Partner mobile applications
- Cloudinary document & vehicle photo upload integration
