const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const User = require('../models/User');

const db = require('../config/database');
const nodemailer = require('nodemailer');
const { promisify } = require('util');

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

exports.sendResetPasswordEmail = async ({ email, token }) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    //secure: true, // true for 2525, false for other ports
    auth: {
      user: "771665ecc3651e",
      pass: "7b644c3d808283"
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'want <want-support@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Password Reset Request', // Subject line
    html: `
      <p>You have requested a password reset for your account. Please follow the link below to reset your password:</p>
      <a href="http://localhost:3000/recoveryPassword/${token}">Reset Password</a>
      <p>"http://localhost:3000/recoveryPassword/${token}"></p>
      <p>If you did not make this request, please ignore this email and your password will remain unchanged.</p>
    `
  });

  //console.log('Message sent: %s', info.messageId);
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User with that email does not exist');
    }

    // Generate reset password token
    const token = await (await bcrypt.hash(Date.now().toString(), 10)).replace("/","n");

    // Store reset password token and expiration date in user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1800000; // 30 minutes from now
    await user.save();

    // Send password reset email
    await this.sendResetPasswordEmail({ email, token });

    res.status(200).send('Password reset email sent');
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset password token and check if token is not expired
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).send('Invalid or expired password reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and remove reset password token and expiration date
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send('Password successfully reset');
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const User = mongoose.model('User');
    const { currentPassword, newPassword } = req.body;

    // Get the user from the session
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // Check if the current password is correct
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).send('Incorrect current password');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send('Password successfully changed');
  } catch (err) {
    next(err);
  }
};

