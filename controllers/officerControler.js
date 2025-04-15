const Officer = require('./models/Officer');
const AppError = require('../utils/appError');

exports.activateOfficer = async (req, res, next) => {
  try {
    const { username, activationKey } = req.body;

    // 1) Check if activation key is correct (in production, this would be more secure)
    if (activationKey !== process.env.ADMIN_ACTIVATION_KEY) {
      return next(new AppError('Invalid activation key', 401));
    }

    // 2) Find officer and activate
    const officer = await Officer.findOneAndUpdate(
      { username, isActive: false },
      { isActive: true, activatedAt: Date.now() },
      { new: true }
    );

    if (!officer) {
      return next(new AppError('No officer account found or account already activated', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Officer account activated successfully',
      data: {
        officer
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getOfficerProfile = async (req, res, next) => {
  try {
    const officer = await Officer.findById(req.officer._id).select('-password');

    res.status(200).json({
      status: 'success',
      data: {
        officer
      }
    });
  } catch (err) {
    next(err);
  }
};