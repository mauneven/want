const mongoose = require('mongoose');
const User = require('../models/User');

exports.getCurrentUser = async (req, res, next) => {
  try {
    const User = mongoose.model('User');

    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCurrentUser = async (req, res, next) => {
  try {
    const User = mongoose.model('User');
    const userId = req.session.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phone = req.body.phone;
    user.birthdate = req.body.birthdate;

    await user.save();

    res.status(200).send('User updated successfully');
  } catch (err) {
    next(err);
  }
};
