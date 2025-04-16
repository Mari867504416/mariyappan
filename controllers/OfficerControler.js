const Officer = require('../models/Officer');
const AppError = require('../utils/appError');
const logger = require('../utils/logger'); // Optional: for better logging

// Constants for error messages
const ERROR_MESSAGES = {
  INVALID_KEY: 'Invalid activation key',
  NO_PENDING_ACCOUNT: 'No pending officer account found',
  PROFILE_ERROR: 'Error fetching officer profile'
};

const activateOfficer = async (req, res, next) => {
  try {
    const { username, activationKey } = req.body;

    // Validate input
    if (!username || !activationKey) {
      return next(new AppError('Username and activation key are required', 400));
    }

    // Verify activation key
    if (activationKey !== process.env.ADMIN_ACTIVATION_KEY) {
      logger.warn(`Failed activation attempt for user: ${username}`);
      return next(new AppError(ERROR_MESSAGES.INVALID_KEY, 401));
    }

    // Activate officer
    const officer = await Officer.findOneAndUpdate(
      { username, isActive: false },
      { 
        isActive: true, 
        activatedAt: Date.now(),
        activatedBy: req.user?.id // Track who activated the account
      },
      { 
        new: true, 
        runValidators: true,
        context: 'query' // Ensures validators run with correct context
      }
    ).select('-password');

    if (!officer) {
      return next(new AppError(ERROR_MESSAGES.NO_PENDING_ACCOUNT, 404));
    }

    logger.info(`Officer activated: ${username}`);

    res.status(200).json({
      status: 'success',
      data: { officer }
    });

  } catch (err) {
    logger.error(`Activation error: ${err.message}`);
    next(err);
  }
};

const getOfficerProfile = async (req, res, next) => {
  try {
    if (!req.officer?._id) {
      return next(new AppError('Invalid officer ID', 400));
    }

    const officer = await Officer.findById(req.officer._id)
      .select('-password -__v -resetToken -resetTokenExpires');

    if (!officer) {
      return next(new AppError('Officer not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { officer }
    });

  } catch (err) {
    logger.error(`${ERROR_MESSAGES.PROFILE_ERROR}: ${err.message}`);
    next(new AppError(ERROR_MESSAGES.PROFILE_ERROR, 500));
  }
};

module.exports = {
  activateOfficer,
  getOfficerProfile
};
