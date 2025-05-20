const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const getrouters = require('./routes/getrouters');
const faceRecognitionRoutes = require('./routes/face_re');  // Import the face recognition routes
const loginRoutes = require('./routes/login');  // Import the login routes
const cors = require('cors');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', getrouters);  // Location routes
app.use('/face-recognition', faceRecognitionRoutes);  // Face recognition routes
app.use('/login', loginRoutes);  // Login routes

app.get('/test', (req, res) => {
  res.json({ message: "Server is working!" });
});

// Error Handlers
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message,
    ...(req.app.get('env') === 'development' && { stack: err.stack })
  });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
