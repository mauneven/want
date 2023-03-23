const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

postSchema.methods.canBeEditedBy = function(user) {
  return user && (this.author.equals(user._id) || user.role === 'admin');
};

module.exports = mongoose.model('Post', postSchema);