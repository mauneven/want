const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Conectar a la base de datos
connectDB();

// Configurar middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: "mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/?retryWrites=true&w=majority",
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }),
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  },
}));

// Configurar rutas
app.use('/api', authRoutes);
app.use('/api', postRoutes);

// Manejo de errores
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Ha ocurrido un error' });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
