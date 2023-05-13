const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const reportRoutes = require('./routes/reportRoutes');
const User = require('./models/user');
const offerRoutes = require('./routes/offerRoutes');
const docxRoutes = require('./routes/docxRoutes.js');
const authController = require('./controllers/authController');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    'http://www.want.com.co:3000',
    'https://www.want.com.co:3000',
    'http://want.com.co',
    'https://want.com.co',
    'http://35.225.113.125',
    'https://35.225.113.125/',
    'http://localhost:3000',
  ],
  credentials: true
}));

app.use('/uploads', express.static('uploads'));
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
      req.session.user = user; // Añade esta línea para actualizar la sesión
    } else {
      delete req.session.userId;
    }
  }
  next();
});

app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', offerRoutes);
app.use("/api", docxRoutes);
app.use('/api', reportRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

// Definir el puerto según el entorno
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;

if (process.env.NODE_ENV === 'production') {
  // para la main
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/want.com.co/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/want.com.co/fullchain.pem')
  };

  https.createServer(options, app).listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
} else {
  // para development
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
