const AppError = require('./appError');

exports.validateActivationKey = (key) => {
  if (key !== process.env.ADMIN_ACTIVATION_KEY) {
    throw new AppError('Invalid activation key', 401);
  }
  return true;
};