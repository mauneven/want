// database.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Base de datos conectada');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

module.exports = connectDB;