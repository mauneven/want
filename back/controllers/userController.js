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
        res.status(404).send('User not found');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (err) {
    next(err);
  }
};