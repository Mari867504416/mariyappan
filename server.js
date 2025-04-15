require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Add this line
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // <-- Use it here
app.use(express.json());
app.use(morgan('dev'));

// ... rest of your server code



// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/officers', officerRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Connect to database
connectDB();
