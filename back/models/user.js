const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photo: String,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: String,
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  birthdate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  totalOffers: {
    type: Number,
    default: 0
  },
  mainCategoryCounts: {
    type: Object,
    default: {}
  },
  subCategoryCounts: {
    type: Object,
    default: {}
  },
  thirdCategoryCounts: {
    type: Object,
    default: {}
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  putUpForElimination: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    }
  ],
  verificationTokenExpires: Date,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('User', userSchema);