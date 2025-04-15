const Officer = require('./models/Officer');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1) Check if username and password exist
    if (!username || !password) {
      return next(new AppError('Please provide username and password!', 400));
    }

    // 2) Check if officer exists and password is correct
    const officer = await Officer.findOne({ username }).select('+password +isActive');

    if (!officer || !(await officer.correctPassword(password, officer.password))) {
      return next(new AppError('Incorrect username or password', 401));
    }

    // 3) Check if account is activated
    if (!officer.isActive) {
      return next(new AppError('Account not activated. Please contact admin.', 401));
    }

    // 4) If everything ok, send token to client
    const token = signToken(officer._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        officer: {
          id: officer._id,
          fullName: officer.fullName,
          username: officer.username,
          mobileNumber: officer.mobileNumber
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { fullName, mobileNumber, username, password } = req.body;

    // 1) Check if username already exists
    const existingOfficer = await Officer.findOne({ username });
    if (existingOfficer) {
      return next(new AppError('Username already exists', 400));
    }

    // 2) Create new officer (not active by default)
    const newOfficer = await Officer.create({
      fullName,
      mobileNumber,
      username,
      password
    });

    // 3) Send response (no token yet since account needs activation)
    res.status(201).json({
      status: 'success',
      message: 'Account created. Waiting for admin activation.',
      data: {
        officer: {
          id: newOfficer._id,
          fullName: newOfficer.fullName,
          username: newOfficer.username,
          mobileNumber: newOfficer.mobileNumber
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if officer still exists
    const currentOfficer = await Officer.findById(decoded.id);
    if (!currentOfficer) {
      return next(new AppError('The officer belonging to this token no longer exists.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.officer = currentOfficer;
    next();
  } catch (err) {
    next(err);
  }
};