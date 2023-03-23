const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Configuración de la sesión
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority',
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 día en segundos
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 día
  },
}));

// Configuración del body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de las rutas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// Configuración de la base de datos
mongoose.connect('mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    // Inicio del servidor
    app.listen(4000, () => {
      console.log('Servidor iniciado en el puerto 4000');
    });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
