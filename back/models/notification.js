const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: { // Añade este campo
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Notification', notificationSchema);
