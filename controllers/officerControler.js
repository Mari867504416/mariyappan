const Officer = require('../models/Officer');
const AppError = require('../utils/appError');

const activateOfficer = async (req, res, next) => {
  try {
    const { username, activationKey } = req.body;

    // 1) Check activation key
    if (activationKey !== process.env.ADMIN_ACTIVATION_KEY) {
      return next(new AppError('Invalid activation key', 401));
    }

    // 2) Find and activate officer
    const officer = await Officer.findOneAndUpdate(
      { username, isActive: false },
      { isActive: true, activatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!officer) {
      return next(new AppError('No pending officer account found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { officer }
    });
  } catch (err) {
    next(err);
  }
};

const getOfficerProfile = async (req, res, next) => {
  try {
    // Exclude password and sensitive fields
    const officer = await Officer.findById(req.officer._id)
      .select('-password -__v');

    res.status(200).json({
      status: 'success',
      data: { officer }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  activateOfficer,
  getOfficerProfile
};
