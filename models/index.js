const mongoose = require('mongoose');
const Officer = require('../Officer');

// If you have multiple models, you can import and export them here
const models = {
  Officer
};

// Establish any model relationships here if needed
// For example, if you had related models:
// Officer.hasMany(OtherModel);
// OtherModel.belongsTo(Officer);

// Export all models and mongoose connection
module.exports = {
  ...models,
  mongoose,
  
  // Helper function to connect to database
  connectDB: async (uri) => {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected successfully');
      return mongoose.connection;
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  },
  
  // Helper function to disconnect from database
  disconnectDB: async () => {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};
module.exports = {
  Officer: require('./Officer')
};
