const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const User = require('../models/User');

const db = require('../config/database');

exports.register = async (req, res, next) => {
  try {
    const User = mongoose.model('User');

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).send('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });
    await user.save();

    // Store user data in session
    req.session.userId = user._id;

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const User = mongoose.model('User');


    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // Store user data in session
    req.session.userId = user._id;

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.isLoggedIn = (req, res) => {
  if (req.session.userId) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};


exports.logout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.clearCookie('connect.sid');
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
