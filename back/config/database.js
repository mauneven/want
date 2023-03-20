const mongoose = require('mongoose');

// URL de conexión a la base de datos
const dbUrl = process.env.DB_URL;

// Conexión a la base de datos
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Manejador de eventos de la conexión
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', function() {
  console.log('Conexión exitosa a la base de datos');
});

module.exports = mongoose;
