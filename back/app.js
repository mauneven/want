const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
<<<<<<< Updated upstream
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
  rolling: true,
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
=======
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const User = require('./models/User');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority',
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 14 * 24 * 60 * 60 * 1000 // = 14 days. Default
  }
}));

app.use(async (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      req.user = user;
    } else {
      delete req.session.userId;
    }
  }
  next();
});

app.use('/api', authRoutes);
app.use('/api', postRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

mongoose.connect('mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
  app.listen(4000, () => {
    console.log('Server started on port 4000');
  });
}).catch((err) => {
  console.error(err);
});
>>>>>>> Stashed changes
