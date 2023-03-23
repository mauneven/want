const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

module.exports = { db };
