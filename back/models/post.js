const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  mainCategory: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  thirdCategory: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  photos: [{
    type: String,
    required: true
  }],  
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    }
  ]
});

postSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Post', postSchema);