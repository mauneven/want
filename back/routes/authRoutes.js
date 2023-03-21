// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use((req, res, next) => {
    console.log(`Método: ${req.method} - Ruta: ${req.originalUrl}`);
    next();
  });

module.exports = router;