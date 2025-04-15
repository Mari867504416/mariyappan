require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // Add this line
const morgan = require('morgan');

// Connect to database
connectDB();

const app = express();
// ... rest of your code


// Middleware
app.use(morgan('dev'));
app.use(cors());
// ... rest of your code

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
