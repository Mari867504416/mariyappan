const AppError = require('../utils/appError');

// Role-based access control (if needed in future)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.officer.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};