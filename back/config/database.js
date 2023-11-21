const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://development:6BEaPzIzIb2CMSom@cluster0.jhnshdi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

module.exports = { db };
