const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');

const app = express();

// Conectar a la base de datos
connectDB();

// Configurar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority" }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Configurar rutas
app.use('/api', authRoutes);
app.use('/api', postRoutes);

// Agregar middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Ha ocurrido un error' });
});

// Iniciar servidor
app.listen(4000, () => console.log('Servidor iniciado en el puerto 4000'));

//Agregar consola de prueba
app.post('/api/register', (req, res) => {
  console.log('Solicitud recibida');
  res.json({ message: 'Solicitud recibida' });
});

