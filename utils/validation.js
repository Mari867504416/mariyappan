const validator = require('validator');
const AppError = require('./appError');

exports.validateSignupInput = (data) => {
  const errors = {};

  if (!validator.isLength(data.fullName, { min: 2, max: 50 })) {
    errors.fullName = 'Full name must be between 2 and 50 characters';
  }

  if (!validator.isMobilePhone(data.mobileNumber)) {
    errors.mobileNumber = 'Please provide a valid mobile number';
  }

  if (!validator.isLength(data.username, { min: 3, max: 20 })) {
    errors.username = 'Username must be between 3 and 20 characters';
  }

  if (!validator.isLength(data.password, { min: 8 })) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};